import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'

export function xhr(requestConfig: AxiosRequestConfig): AxiosPromise {
  return new Promise(resolve => {
    const { data = null, url, method = 'get', headers, responseType } = requestConfig

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    request.open(method.toUpperCase(), url, true)
    // open之后设置headers
    Object.keys(headers).forEach(header => {
      if (data === null && header.toLocaleLowerCase() === 'content-type') {
        delete headers[header]
      } else {
        request.setRequestHeader(header, headers[header])
      }
    })

    request.onreadystatechange = function() {
      if (request.readyState !== 4) return
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType === 'text' ? request.responseText : request.response
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: requestConfig,
        request
      }
      resolve(response)
    }

    request.send(data)
  })
}
