#!/bin/sh
# 启动后的插件激活判定:读实例日志,判断 Host 半区是不是真的活着。
#
# 用法: sh scripts/activation-verdict.sh <日志文件> [最长等待秒数,缺省 10]
# 退出码: 0 = 已激活(✓)或无法判定(⚠)   1 = 激活失败(✗)
#
# 为什么需要它(坑 #21 真机教训):Host 半区激活失败时,dsh 照常打印带 token 的地址、
# 页面照常能打开——但数据服务 / agent 工具 / 投影全部不可用。光看"拿到了地址"等于谎报成功。
#
# 判定信号(取自骨架 index.js 的启动日志;改了那几行文案会落到 ⚠):
#   ✓  [wb-data] 已注册 N 个 agent 工具      apply() 走到了最后一行
#   ✗  dsh: warning: N entry did not activate dsh 自己报的激活失败(下一行起是 diagnostic)
# 以**最后一次**激活尝试为准:HMR / file-change reload 会在同一进程里再激活一次。
LOG="$1"
WAIT="${2:-10}"

if [ -z "$LOG" ] || [ ! -f "$LOG" ]; then
  echo "[start] ⚠ 没有实例日志,无法判定插件激活状态"
  exit 0
fi

N=0
FAIL_LINE=""
OK_LINE=""
while :; do
  FAIL_LINE=$(grep -n "did not activate" "$LOG" 2>/dev/null | tail -1 | cut -d: -f1)
  OK_LINE=$(grep -nE "\[wb-data\] 已注册 [0-9]+ 个 agent 工具" "$LOG" 2>/dev/null | tail -1 | cut -d: -f1)
  if [ -n "$FAIL_LINE" ] || [ -n "$OK_LINE" ]; then break; fi
  N=$((N + 1))
  if [ "$N" -ge "$WAIT" ]; then break; fi
  sleep 1
done

if [ -n "$OK_LINE" ] && { [ -z "$FAIL_LINE" ] || [ "$OK_LINE" -gt "$FAIL_LINE" ]; }; then
  echo "[start] ✓ 插件 Host 半区已激活"
  exit 0
fi

if [ -n "$FAIL_LINE" ]; then
  echo "[start] ✗ 插件 Host 半区激活失败——地址能打开,但数据服务/agent 工具/投影全部不可用"
  # diagnostic 首行 + 栈里**项目目录内**的第一帧。dsh 自身的前几帧(authorError 之类)不可操作,
  # 能定位问题的是你自己代码的那一帧;栈里没有项目帧(错误纯出自宿主)就退回打印前三行
  DETAIL=$(sed -n "$((FAIL_LINE + 1)),$((FAIL_LINE + 40))p" "$LOG")
  printf '%s\n' "$DETAIL" | head -1 | sed 's/^/[start]   /'
  ROOT=$(cd "$(dirname "$0")/.." && pwd -P) # 物理路径:栈里是 node 解析过的 realpath
  FRAME=$(printf '%s\n' "$DETAIL" | grep -F "file://$ROOT/" | head -1)
  if [ -n "$FRAME" ]; then
    FRAME=${FRAME#*file://$ROOT/}
    FRAME=${FRAME%)}
    echo "[start]   抛错位置: $FRAME"
  else
    printf '%s\n' "$DETAIL" | sed -n '2,4p' | sed 's/^/[start]   /'
  fi
  echo "[start]   修好后重跑 ./start.sh;实例在跑时也可经插件管理器 disable→enable 重激(坑 #21)"
  echo "[start]   完整日志:$LOG"
  exit 1
fi

echo "[start] ⚠ 等待 ${WAIT}s 未见插件就绪日志——若你改过 index.js 的启动日志文案可忽略,否则查:$LOG"
exit 0
