/**
 * 路由的 HTTP 错误:业务校验失败、找不到资源等,用 4xx 回应,而不是 500。
 * 用法:在路由或 service 函数里 `throw new HttpError(400, '标题不能为空')`(return 它也可以),
 * 分发器(index.js)会按给定的状态码回应 { error, code }。
 */
export class HttpError extends Error {
  constructor(status, message, code) {
    super(message)
    this.name = 'HttpError'
    this.httpStatus = status
    this.code = code
  }
}
