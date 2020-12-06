import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { createdError } from '../helpers/class/error'
import { parseHeaders } from '../helpers/headers'
import { isURLSameOrigin } from '../helpers/url'
import { isFormData } from '../helpers/utlis'
import cookie from '../helpers/cookie'

export function xhr(requestConfig: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress
    } = requestConfig

    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url!, true)

    // 配置config
    configureRequest()
    // 添加请求事件处理
    addEvents()
    // 处理headers
    processHeaders()
    // 处理取消
    processCancel()

    request.send(data)

    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }

      if (timeout) {
        request.timeout = timeout
      }

      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    function addEvents(): void {
      request.onerror = function() {
        reject(createdError('network Error', requestConfig, null, request))
      }

      request.ontimeout = function() {
        reject(createdError(`timeout of ${timeout} ms`, requestConfig, 'ECONNABORTED', request))
      }

      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
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
    }

    function processHeaders(): void {
      // 上传发送请求格式为FormData类型(上传文件) 浏览器会自动添加content-type:multipart/form-data
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      Object.keys(headers).forEach(header => {
        if (data === null && header.toLocaleLowerCase() === 'content-type') {
          delete headers[header]
        } else {
          request.setRequestHeader(header, headers[header])
        }
      })
    }

    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise
          .then(reason => {
            request.abort()
            reject(reason)
          })
          .catch(() => {
            // nothing
          })
      }
    }

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
