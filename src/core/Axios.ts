import dispatchRequest from './dispatchRequest'
import { Method, AxiosRequestConfig, AxiosPromise } from '../types'

class Axios {
  request(config: AxiosRequestConfig) {
    return dispatchRequest(config)
  }

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
    return dispatchRequest(requestConfig)
  }

  _requestMethodWithData(
    url: string,
    method: Method,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    const requestConfig = Object.assign(config || {}, { url, method, data })
    return dispatchRequest(requestConfig)
  }
}

export default Axios
