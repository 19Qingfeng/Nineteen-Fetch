import { AxiosRequestConfig, AxiosResponse } from '../../types'

export class AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: number | string | null
  request?: XMLHttpRequest
  response?: AxiosResponse
  constructor(
    message: string,
    config: AxiosRequestConfig,
    code?: number | string | null,
    request?: XMLHttpRequest,
    response?: AxiosResponse
  ) {
    super(message)
    this.isAxiosError = true
    this.config = config
    this.code = code
    this.request = request
    this.response = response

    // 解决typescript 继承问题
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

export function createdError(
  message: string,
  config: AxiosRequestConfig,
  code?: number | string | null,
  request?: XMLHttpRequest,
  response?: AxiosResponse
) {
  const error = new AxiosError(message, config, code, request, response)
  return error
}
