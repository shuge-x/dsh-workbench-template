#!/bin/sh
# dsh 工作台启动脚本:构建 → profile 初始化 → 登记插件 → 停旧起新 → 打印访问地址
# 用法: ./start.sh [profile] [port]
#   profile 缺省取自 cordis.patch.yml 的 insert id;端口缺省 3125
#   示例: ./start.sh            # 缺省 profile + 3125
#         ./start.sh wbs 3125   # 指定 profile 与端口
set -e
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "[start] 首次运行,安装依赖…"
  npm install --silent
fi

echo "[start] 构建前端…"
npm run build --silent

PROFILE="${1:-$(grep -oE 'id: +[a-z0-9-]+' cordis.patch.yml | head -1 | awk '{print $2}')}"
PORT="${2:-3125}"
DSH="npx @deepseek-ai/dsh"

# 全新 profile 是 base 模板(坑 #7):先初始化出 web 壳
if [ ! -d "$HOME/.dsh/profiles/$PROFILE" ]; then
  echo "[start] 初始化 profile $PROFILE(web 壳)…"
  # 语义:复制 profile 后会前台起服务并持续运行——必须后台起、限时、杀;
  # 用 PORT+1 避开默认 3080(被其他运行中的实例/任务占用时依然可行)
  $DSH --profile "$PROFILE" --from-default-profile web --port "$((PORT + 1))" >/dev/null 2>&1 &
  INITPID=$!
  sleep 6
  kill "$INITPID" 2>/dev/null || true
  wait "$INITPID" 2>/dev/null || true
fi

echo "[start] 登记插件(幂等)…"
$DSH plugin --profile "$PROFILE" add "$PWD"

# 端口策略:被占时——同 profile = 重启自己(杀掉重用端口);异 profile = 自动找下一个空闲端口,不碰别人
TRIES=0
while lsof -nP -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; do
  HOLDER=$(lsof -nP -iTCP:$PORT -sTCP:LISTEN | tail -1 | awk '{print $2}')
  if ps -p "$HOLDER" -o command= 2>/dev/null | grep -q -- "--profile $PROFILE"; then
    echo "[start] 端口 $PORT 是自己的旧实例,重启…"
    kill "$HOLDER" || true
    sleep 1
  else
    echo "[start] 端口 $PORT 被其他实例占用,自动换下一个…"
    PORT=$((PORT + 1))
  fi
  TRIES=$((TRIES + 1))
  [ "$TRIES" -ge 20 ] && { echo "[start] ✗ 20 个端口都被占,放弃"; exit 1; }
done

echo "[start] 启动(profile=$PROFILE port=$PORT)…"
LOG="/tmp/dsh-$PROFILE.log"
nohup $DSH --profile "$PROFILE" --no-open --port "$PORT" > "$LOG" 2>&1 &

sleep 8
TOKEN=$(grep -oE 'token=[A-Za-z0-9_-]*' "$LOG" | tail -1)
if [ -n "$TOKEN" ]; then
  echo "[start] ✓ http://127.0.0.1:$PORT/?$TOKEN"
  open "http://127.0.0.1:$PORT/?$TOKEN" 2>/dev/null || true
else
  echo "[start] ✗ 未拿到 token,查看日志:$LOG"
  exit 1
fi
