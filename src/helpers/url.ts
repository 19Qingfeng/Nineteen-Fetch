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

export function buildUrl(url: string, params?: any): string {
  return ''
}
