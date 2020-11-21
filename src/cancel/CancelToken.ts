import { CancelExecutor, CancelTokenSource, Canceler } from '../types'
import Cancel from './Cancel' // 类既可以被当作值使用也可以当作类型

interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    // 取消方法实质就是resolvePromise
    let resolvePromise: ResolvePromise
    this.promise = new Promise<Cancel>(reslove => {
      resolvePromise = reslove
    })
    // 传入的executor函数 需要接受取消函数参数
    executor(message => {
      if (this.reason) return
      this.reason = new Cancel(message)
      resolvePromise(this.reason)
    })
  }

  throwIfRequested() {
    if (this.reason) {
      throw this.reason
    }
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
