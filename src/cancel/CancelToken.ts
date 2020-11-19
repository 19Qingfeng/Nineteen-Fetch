import { CancelExecutor, CancelTokenSource, Canceler } from '../types'

interface ResolvePromise {
  (reason?: string): void
}

export class CancelToken {
  promise: Promise<string>
  reason?: string

  constructor(executor: CancelExecutor) {
    // 取消方法实质就是resolvePromise
    let resolvePromise: ResolvePromise
    this.promise = new Promise<string>(reslove => {
      resolvePromise = reslove
    })
    // 传入的executor函数 需要接受取消函数参数
    executor(message => {
      if (this.reason) return
      this.reason = message
      resolvePromise(this.reason)
    })
  }

  static source(): CancelTokenSource {
    let cancelFn!: Canceler // 取消函数
    const token = new CancelToken(function(c) {
      cancelFn = c
    })
    return {
      token,
      cancel: cancelFn
    }
  }
}
