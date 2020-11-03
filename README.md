# ts for axios

### Get请求Params拼接Ur
#### done

### Post请求data格式化
#### done

### requestHeader format
#### done

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

#