/*

    URL参数处理需求：

    处理get请求Url参数 url拼接 接受url和params 返回新的url
    处理 params
    array 类型 params = { arr:[1,2,3] }:arr[] -> arr[]=1&arr[]=2&arr[]=3

    object 类型 params = { foor:{ bar:'baz' } } -> 最终请求的 url 是 /base/get?foo=%7B%22bar%22:%22baz%22%7D，foo 后面拼接的是 {"bar":"baz"} encode 后的结果。

    date 类型 最终请求的 url 是 /base/get?date=2019-04-01T05:55:39.030Z，date 后面拼接的是 date.toISOString() 的结果。

    对于字符 @、:、$、,、、[、]，我们是允许出现在 url 中的，不希望被 encode

    对于值为 null 或者 undefined 的属性，我们是不会添加到 url 参数中的。

    丢弃 url 中的哈希标记

    保留 url 中已存在的参数

*/
import { isPlaneObject, isDate } from './utlis'

interface URLOrigin {
  host: string
  protocol: string
}

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildUrl(url: string, params?: any): string {
  if (!params) {
    return url
  }

  const keys = Object.keys(params)

  const part: string[] = []

  keys.forEach(key => {
    let val = params[key]
    if (val === undefined || val === null) return
    let value: any[]
    // 统一处理 全部转为array处理
    if (Array.isArray(val)) {
      value = val
      key = `${key}[]`
    } else {
      value = [val]
    }
    value.forEach(val => {
      if (isPlaneObject(val)) {
        val = JSON.stringify(val)
      }
      if (isDate(val)) {
        val = val.toISOString()
      }
      part.push(`${encode(key)}=${encode(val)}`)
    })
  })

  let serializedParams = part.join('&')

  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) url = url.slice(0, markIndex)
    // 处理是否存在&
    url += url.indexOf('?') === -1 ? `?${serializedParams}` : `&${serializedParams}`
  }

  return url
}
// 是否同源
export function isURLSameOrigin(url: string): boolean {
  const { host, protocol } = resolveURL(url)
  return host === currentOrigin.host && protocol === currentOrigin.protocol
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

// 解析URL域名和协议
// 这里使用了a标签 同样可以使用new URL(url).host/protocol
function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  return {
    host: urlParsingNode.host,
    protocol: urlParsingNode.protocol
  }
}
