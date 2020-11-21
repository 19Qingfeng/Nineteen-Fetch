import dispatchRequest from './dispatchRequest'
import { isPlaneObject } from '../helpers/utlis'
import {
  Method,
  AxiosRequestConfig,
  AxiosPromise,
  AxiosResponse,
  ResolvedFn,
  RejecedFn
} from '../types'
import InterceptorManager from './InterceptorManager'
import mergeConfig from './mergeConfig'

interface Interceptor {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface ProimiseChain {
  resolved: ResolvedFn | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejecedFn
}

class Axios {
  interceptors: Interceptor
  defaults: AxiosRequestConfig
  constructor(defaultsConfig: AxiosRequestConfig) {
    // 初始化defaults配置
    this.defaults = defaultsConfig
    // 初始化request和response拦截器对象
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }

  request(url: any, config?: any) {
    if (typeof url === 'string') {
      if (!isPlaneObject(config)) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }
    // 合并默认配置参数
    config = mergeConfig(this.defaults, config)
    // 创建Promise链 默认发送请求逻辑
    const proimiseChain: Array<ProimiseChain> = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]

    // 获取所有拦截器对象
    this.interceptors.request.forEach(interceptor => {
      const { resolvedFn, rejectedFn } = interceptor
      proimiseChain.unshift({
        resolved: resolvedFn,
        rejected: rejectedFn
      })
    })

    this.interceptors.response.forEach(interceptor => {
      const { resolvedFn, rejectedFn } = interceptor
      proimiseChain.push({
        resolved: resolvedFn,
        rejected: rejectedFn
      })
    })

    // Promise链式调用
    let promise = Promise.resolve(config)
    while (proimiseChain.length) {
      // 数组shift返回的是T | undefined 所以！断言
      const { resolved, rejected } = proimiseChain.shift()!

      promise = promise.then(resolved, rejected)
    }

    // return dispatchRequest(config)
    return promise
  }

  // axios上存在interceptors属性
  // interceptors 存在response和request 两个属性 这两个属性分别是一个拦截器对象

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData(url, 'get', config)
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData(url, 'delete', config)
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData(url, 'head', config)
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData(url, 'options', config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData(url, 'post', data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData(url, 'put', data, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData(url, 'patch', data, config)
  }

  _requestMethodWithoutData(
    url: string,
    method: Method,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    const requestConfig = Object.assign(config || {}, { url, method })
    return this.request(requestConfig)
  }

  _requestMethodWithData(
    url: string,
    method: Method,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    const requestConfig = Object.assign(config || {}, { url, method, data })
    return this.request(requestConfig)
  }
}

export default Axios
