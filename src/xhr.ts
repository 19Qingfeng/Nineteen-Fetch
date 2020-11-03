import { AxiosRequestConfig } from './types'

export function xhr(config: AxiosRequestConfig): void {
  const { data = null, url, method = 'get', headers } = config

  const request = new XMLHttpRequest()

  request.open(method.toUpperCase(), url, true)
  // open之后设置headers
  Object.keys(headers).forEach(header => {
    if (data === null && header.toLocaleLowerCase() === 'content-type') {
      delete headers[header]
    } else {
      request.setRequestHeader(header, headers[header])
    }
  })

  request.send(data)
}
