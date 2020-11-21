export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'options'
  | 'OPTIONS'
  | 'head'
  | 'HEAD'
  | 'put'
  | 'PUT'
  | 'post'
  | 'POST'
  | 'patch'
  | 'PATCH'

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
  transformRequest?: AxiosTranformer | AxiosTranformer[]
  transformResponse?: AxiosTranformer | AxiosTranformer[]
  cancelToken?: CancelToken
  withCredentials?: boolean
  [propName: string]: any
}

export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: XMLHttpRequest
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

export interface AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string | null
  request?: XMLHttpRequest
  response: AxiosResponse
}

interface Axios {
  defaults: AxiosRequestConfig

  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }

  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance

  CancelToken: CancelTokenStatic
  Cancel: CancelStatic // axios官网兼容 好像并无作用
  isCancel: (val: any) => boolean
  // isCancel(val: any): boolean
}

export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejeced?: RejecedFn): number

  eject(id: number): void
}
// 请求拦截器是axiosRequestConfig类型 响应拦截器是axiosResponse类型
export interface ResolvedFn<T = any> {
  (val: T): T | Promise<T> // 同步逻辑和异步逻辑
}

export interface RejecedFn {
  (val: any): any
}

export interface AxiosTranformer {
  (data: any, header?: any): any
}

// CancelToken实例类型
export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel
  throwIfRequested(): void
}

// 取消方法类型
export interface Canceler {
  (message?: string): void
}

// 取消构造函数接受方法参数
export interface CancelExecutor {
  (cancel: Canceler): void
}

// source方法返回类型
export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

// CancelToken类类型
export interface CancelTokenStatic {
  new (fn: CancelExecutor): CancelToken

  source(): CancelTokenSource
}

// 取消类实例类型 - 适用于代替reason 判断axios.isCancel
export interface Cancel {
  message?: string
}

export interface CancelStatic {
  new (message?: string): Cancel
}
