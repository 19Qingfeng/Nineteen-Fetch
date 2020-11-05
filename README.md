# ts for axios

### Get 请求 Params 拼接 Url

> <font size=2 color=red>完成</font>

### Post 请求 data 格式化

> <font size=2 color=red>完成</font>

### requestHeader format

> <font size=2 color=red>完成</font>

> 请求逻辑告一段落。(get 请求拼接 params，post 请求 data 格式化，格式化 requestHeaders)

- get 请求拼接 params。

- post 请求 data 格式化，对于 object 格式自动 JSON.stringify。

- 格式化 headers，对于 data 存在 JSON 对象，默认添加 content-type。

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

> 需求：拿到 res 对象，并且我对象包括：服务端返回的数据 data，HTTP 状态码 status，状态消息 statusText，响应头 headers、请求配置对象 config 以及请求的 XMLHttpRequest 对象实例 request。

> <font size=2 color=red>完成</font>

### 处理响应 header

> 之前处理了基于 Promise 链式调用获取 responseData，但是返回的 responseHeaders(xml.getAllResponseHeaders)获得是一个字符串。这样并不好用，所以这里将 headers 字符串转换成对象形式使用。

###### 返回 Headers 数据格式

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

> <font size=2 color=red>完成</font>

### 处理响应 Data

> 需求:返回的数据如果满足 JSON 字符串格式，即使没有设置 xml 实例对象的 responseType:json，那么希望默认得到的数据是经过转化的 JSON 对象而不是 JSON 字符串。（现在只有手动设置 request.responseType = 'json'）返回的 data 数据才会 json 对象格式。

> <font size=2 color=red>完成</font>

> 请求逻辑告一段落。(Promise 链式获取响应数据，格式化 ResponseHeaders，格式化 ResponseData)

- 返回数据基于 Promise 链式获取。

- 格式化 responseHeaders，字符串格式化为 object。

- 格式化 responseData，对于未设置 request.responseType='json'但返回数据是一个 JSON 字符串，默认调用 JSON.parse 格式化。

---

> 之前的逻辑都是基于 Promise 获取正常的请求逻辑，对于实现的请求逻辑并没有处理错误逻辑处理。

### 处理网络错误

> 需求：简单错误错误。

- 网络错误。

- 网络超时。

- 非 2XX 状态码。

### 错误信息增强

> 需求:增强错误信息，返回错误信息非简单 string 提示，同时返回请求配置，状态码以及 request 实例等。
