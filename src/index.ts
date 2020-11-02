import { AxiosRequestConfig } from './types'
import { xhr } from './xhr'
import { buildUrl } from './helpers/url'

function axios(config: AxiosRequestConfig) {
  processCofing(config)
  xhr(config)
}

function processCofing(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
}

function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildUrl(url, params)
}

export default axios
