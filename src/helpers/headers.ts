import { Method } from '../types'
import { isPlaneObject, deepMerge } from './utlis'

/* 
    1. 如果data是一个JSON对象并且header不存在content-type 添加content-type application/json;charset=utf-8
    2. 同时处理requestHeader 不限制区分大小写 所以做一层normaziler
    3. 在setRequsetHeader(xhr发送中) 如果data不存在但是存在content-type属性 那么就删掉他不设置content-type。因为这是没有意义的
    4. 需要注意的是这里判断的是headers是否存在，所以外层必须给header一个默认值{}，才会进入data为JSON对象情况下默认添加content-type的判断（当用户不传递headers的时候）
*/

function normazilerHeader(headers: any, normazilerName: string): any {
  /* 边界处理 */
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(header => {
    if (header !== normazilerName && header.toUpperCase() === normazilerName.toUpperCase()) {
      headers[normazilerName] = headers[name]
      delete headers[header]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  // 格式化防止大小写
  normazilerHeader(headers, 'Content-Type')

  if (isPlaneObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}

export function parseHeaders(headers: string): any {
  const parsed = Object.create(null)
  headers.split('\r\n').forEach(header => {
    let [key, value] = header.split(':')
    key = key.trim().toLowerCase()
    if (!key) return
    if (value) {
      value = value.trim()
    }
    parsed[key] = value
  })
  return parsed
}

export function flattenHeaders(headers: any, method: Method): any {
  // headers可以为null 谨记解构赋值 针对于null不走默认值 undefined才会走默认值
  if (!headers) {
    return headers
  }
  // 将common和对应方法以及config中的headers做一层合并 然后删除
  headers = deepMerge(headers.common, headers[method], headers)
  const methodToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']
  methodToDelete.forEach(method => {
    delete headers[method]
  })
  return headers
}
