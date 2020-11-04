# ts for axios

### Get请求Params拼接Ur
> <font size=10 color='red'>完成</font>


### Post请求data格式化
> <font size=10 color='red'>完成</font>


### requestHeader format
> <font size=10 color='red'>完成</font>


> 请求逻辑告一段落。
---

### 处理响应数据
> 之前的内容，发送的请求都可以从网络层面接收到服务端返回的数据，但是代码层面并没有做任何关于返回数据的处理。接下来处理服务端响应的数据，并支持 Promise 链式调用的方式，
```
axios({
  method: 'post',
  url: '/base/post',
  data: {
    a: 1,
    b: 2
  }
}).then((res) => {
  console.log(res)
})
```
> 需求：拿到 res 对象，并且我对象包括：服务端返回的数据 data，HTTP 状态码status，状态消息 statusText，响应头 headers、请求配置对象 config 以及请求的 XMLHttpRequest 对象实例 request。

> <font size=10 color='red'>完成</font>

### 处理响应 header
> 之前处理了基于Promise链式调用获取responseData，但是返回的responseHeaders(xml.getAllResponseHeaders)获得是一个字符串。这样并不好用，所以这里将headers字符串转换成对象形式使用。
###### 返回Headers数据格式
```
date: Fri, 05 Apr 2019 12:40:49 GMT
etag: W/"d-Ssxx4FRxEutDLwo2+xkkxKc4y0k"
connection: keep-alive
x-powered-by: Express
content-length: 13
content-type: application/json; charset=utf-8
```
###### 处理返回的格式
```
{
  date: 'Fri, 05 Apr 2019 12:40:49 GMT'
  etag: 'W/"d-Ssxx4FRxEutDLwo2+xkkxKc4y0k"',
  connection: 'keep-alive',
  'x-powered-by': 'Express',
  'content-length': '13'
  'content-type': 'application/json; charset=utf-8'
}
```

> <font size=10 color='red'>完成</font>

### 处理响应 Data
> 需求:返回的数据如果满足JSON字符串格式，即使没有设置xml实例对象的responseType:json，那么希望默认得到的数据是经过转化的JSON对象而不是JSON字符串。（现在只有手动设置request.responseType = 'json'）返回的data数据才会json对象格式。

