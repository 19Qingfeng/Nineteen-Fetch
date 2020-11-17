import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { xhr } from './xhr'
import { buildUrl } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'

function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
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
  const { url, params } = config
  return buildUrl(url!, params)
}

function transformResponseData(response: AxiosResponse): AxiosResponse {
  // 抽离公共transform函数处理 request和response都会用到 避免dispatchrequest冗余
  response.data = transform(response.data, response.headers, response.config.transformResponse)
  return response
}

export default dispatchRequest
