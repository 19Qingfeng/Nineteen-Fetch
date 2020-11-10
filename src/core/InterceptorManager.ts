import { ResolvedFn, RejecedFn } from '../types/index'

interface Interceptor<T> {
  resolvedFn: ResolvedFn<T>
  rejectedFn?: RejecedFn
}

export default class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>
  constructor() {
    this.interceptors = []
  }

  use(resolvedFn: ResolvedFn<T>, rejectedFn?: RejecedFn): number {
    this.interceptors.push({
      resolvedFn,
      rejectedFn
    })
    return this.interceptors.length - 1
  }
  // axios类请求前使用调用拦截器
  forEach(fn:(interceptor:Interceptor<T>) => void) : void {
    this.interceptors.forEach(interceptor => {
      if(interceptor !== null) {
        fn(interceptor)
      }
    })
  }

  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }
}
