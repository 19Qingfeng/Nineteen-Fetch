import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { xhr } from './xhr'
import { buildUrl, combineURL, isAbsoluteURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'

function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  processCofing(config)
  return xhr(config).then((response: AxiosResponse) => {
    return transformResponseData(response)
  })
}

function processCofing(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  // 抽离公共transform函数处理 request和response都会用到 避免dispatchrequest冗余
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!) // 合并默认config headers
}

function transformUrl(config: AxiosRequestConfig): string {
  let { url, params, paramsSerializer, baseURL } = config
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url)
  }
  return buildUrl(url!, params, paramsSerializer)
}

function transformResponseData(response: AxiosResponse): AxiosResponse {
  // 抽离公共transform函数处理 request和response都会用到 避免dispatchrequest冗余
  response.data = transform(response.data, response.headers, response.config.transformResponse)
  return response
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void | never {
  if (config.cancelToken) {
    // 不使用config.cancelToken.reason是否存在的判断 模块化编程 将检测放在类中的实例方法是最好的处理方式
    config.cancelToken.throwIfRequested()
  }
}

export default dispatchRequest
