import { AxiosRequestConfig } from './types'
import { xhr } from './xhr'
import { buildUrl } from './helpers/url'
import { transformRequest } from './helpers/data'

function axios(config: AxiosRequestConfig) {
  processCofing(config)
  xhr(config)
}

function processCofing(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.data = transformRequestData(config)
}

function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildUrl(url, params)
}

function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

export default axios
