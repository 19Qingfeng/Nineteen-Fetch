import { isPlaneObject } from './utlis'

/* 
    1. 如果data是一个JSON对象并且header不存在content-type 添加content-type application/json;charset=utf-8
    2. 同时处理requestHeader 不限制区分大小写 所以做一层normaziler
    3. 在setRequsetHeader(xhr发送中) 如果data不存在但是存在content-type属性 那么就删掉他不设置content-type。因为这是没有意义的
    4. 需要注意的是这里判断的是headers是否存在，所以外层必须给header一个默认值{}，才会进入data为JSON对象情况下默认添加content-type的判断（当用户不传递headers的时候）
*/

function normazilerHeader(headers: any, normazilerName: string): any {
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
