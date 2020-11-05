import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { createdError } from './helpers/class/error'
import { parseHeaders } from './helpers/headers'

export function xhr(requestConfig: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout } = requestConfig

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    if (timeout) {
      request.timeout = timeout
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

    request.onerror = function() {
      reject(createdError('network Error', requestConfig, null, request))
    }

    request.ontimeout = function() {
      reject(createdError(`timeout of ${timeout} ms`, requestConfig, 'ECONNABORTED', request))
    }

    request.onreadystatechange = function() {
      if (request.readyState !== 4) return
      // 当网络错误/网络超时也会走到readyState4 请求完成 但是他们的status为0
      if (request.status === 0) return
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
      handleResponse(response)
    }

    request.send(data)

    function handleResponse(response: AxiosResponse): void {
      const { status } = response
      if (status <= 200 && status < 300) {
        resolve(response)
      } else {
        reject(
          createdError(
            `response Error status Code-${status}`,
            requestConfig,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
