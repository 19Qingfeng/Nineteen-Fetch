import { transformResponse, transformRequest } from './helpers/data'
import { processHeaders } from './helpers/headers'
import { AxiosRequestConfig } from './types'
// 关于content-type和accpet
// content-type表示本次请求发送到服务端的格式 accept表示希望本次请求得到的返回数据格式
/* 
    Accept:text/xml； 
    Content-Type:text/html 
    即代表希望接受的数据类型是xml格式，本次请求发送的数据的数据格式是html。
    https://segmentfault.com/a/1190000013056786
*/
/* 
  processHeaders处理的headers是用户传入config的更改
  所以优先级高于methods中和common中 比方说
  一个post请求携带data不携带headerscontent-type 那么它会自动添加application/json而非x-www-form-urlencoded
  flattenHeaders顺序headers = deepMerge(headers.common, headers[method], headers)
*/
const defaults: AxiosRequestConfig = {
  headers: {
    common: {
      Accept: 'application/json,text/plain,*/*'
    }
  },
  transformRequest: [
    // 抽离dispatchRequest中的header和data处理
    function(data: any, headers: any): any {
      processHeaders(headers, data) // header对象 引用类型处理
      data = transformRequest(data)
      return data
    }
  ],
  transformResponse: [
    function(data: any): any {
      return transformResponse(data)
    }
  ]
}

const methodsWithOutData = ['delete', 'get', 'options', 'head']
const methodsWithData = ['post', 'put', 'patch']

methodsWithOutData.forEach(method => {
  defaults.headers[method] = {}
})
methodsWithData.forEach(method => {
  defaults.headers[method] = {
    // 提交的数据按照 key1=val1&key2=val2 的方式进行编码，key 和 val 都进行了 URL 转码
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults
