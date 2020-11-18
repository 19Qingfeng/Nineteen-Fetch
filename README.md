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

---

### 扩展接口

> 需求：基于 axios 本身存在 axios.get/axios.delelte...

- axios.request(config)

- axios.get(url[, config])

- axios.delete(url[, config])

- axios.head(url[, config])

- axios.options(url[, config])

- axios.post(url[, data[, config]])

- axios.put(url[, data[, config]])

- axios.patch(url[, data[, config]])

如果使用了这些方法，我们就不必在 config 中指定 url、method、data 这些属性了。

从需求上来看，axios 不再单单是一个方法，更像是一个混合对象，本身是一个方法，又有很多方法属性，接下来我们就来实现这个混合对象。

### 函数重载

> 需求：Axios 函数实现函数重载。
> 目前 axios 直接调用 函数只支持传入 1 个参数，如下：

```
axios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hi'
  }
})
```

希望该函数也能支持传入 2 个参数，如下：

```
axios('/extend/post', {
  method: 'post',
  data: {
    msg: 'hello'
  }
})
```

### 响应数据支持范型

> 需求：希望通过调用 axios 时可以支持传入范型从而让 TS 可以正确的推断出 response 的类型。
> 简单来说也就是 axios 方法支持传入范型 T，此时 responseData 中的 data 类型就为 T。

> 接口扩展完结。

---

### 拦截器实现

> 需求：

```
// 添加一个请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前可以做一些事情
  return config;
}, function (error) {
  // 处理请求错误
  return Promise.reject(error);
});
// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
  // 处理响应数据
  return response;
}, function (error) {
  // 处理响应错误
  return Promise.reject(error);
});
```

#### 流程图:

![拦截器过程](http://localhost:8081/ts-axios/interceptor.png)

> 并且注意是可以添加多个拦截器的，拦截器的执行顺序是链式依次执行的方式。对于 request 拦截器，后添加的拦截器会在请求前的过程中先执行；对于 response 拦截器，先添加的拦截器会在响应后先执行。

###### 拦截器实现思路过程

- 创建拦截器 interceptorManager 类,对外暴露拥有实例方法 use 添加和 eject 删除，对内 forEach 方法调用。

- Axios 类创建过程，构造函数初始化拦截器对象属性(interceptor 属性)拥有 response 属性(拦截器实例)和 response 属性(拦截器实例)。

- 调用发送请求逻辑时，request 实例方法中处理 Promise 链逻辑。

###### 总结拦截器

> Axios 类实例属性 interceptors,存在 request 和 response 属性。这两个属性分别对应 AxiosInterceptorManager 实例对象(拦截器对象，use，eject 对外暴露方法，内部 forEach 调用)。在 request 发情请求前，采用 Promies 链获取 request 和 response 的拦截器 push，unshift 到对应基本链中。基本链(拥有 resolved:dispatchRequest,rejected:undefind)。

---

### 合并配置的设计和实现

> 需求:类似 Axios 库中可以通过 axios.default 定义一些默认的全局，局部配置。决定不同请求的不同行为：

```
// default属性表示默认行为
// default.common对于全局的axios请求添加默认行为
axios.defaults.headers.common['test'] = 123
// 对于请求类型为post的headers添加的默认行为
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// 默认超时配置
axios.defaults.timeout = 2000
// 默认BaseUrl
axios.defaults.baseURL = 'https://api.example.com';
```

> 其中注意对于 headers 拥有动词 post，get...也就是根据不同的请求方式决定不同的行为（添加不同的默认 headers）。
>
> > in short,通过 axios.default 添加添加请求默认值。

#### default 配置实现

> default.ts 中已经实现了默认了 axios.defaults 属性配置和初始化属性逻辑。

#### 合并配置

> 需求:接下来就要开始实现 axios.defaults 和用户 axios 传入 config 进行合并策略。

###### 不同的配置要求存在不同的合并策略

> config1 是用户自定义的默认配置，而 config2 是用户调用时传入的配置。merged 是合并后的结果。

```
config1 = {
  method: 'get',

  timeout: 0,

  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  }
}

config2 = {
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  },
  headers: {
    test: '321'
  }
}

merged = {
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  },
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
    test: '321'
  }
}
```

- 对于 method，timeout 之类属性使用默认的合并策略。如果 config2(自定义配置)存在覆盖 config1(默认配置)，如果 config2 不存在那么就取默认 config1.

- 对于 url，data，params 字段，因为是这些参数和每一次请求息息相关的。所以应该是自定义传递的，即使在 defaults 中进行了配置也没有任何意义。所以这些字段仅会取 config2 中的值进行合并。

- 对于 headers 之类复杂对象，对于 headers 合并策略并不是单纯的覆盖而是将 confg1 和 config2 进行合并取合并后的值。
  > 复杂类型合并思路：递归(深拷贝+对象合并(对象合并实质就是递归 object 到基础类型的覆盖))。

### flatten headers

> 需求：上边合并之后的 headers 是一个这样的对象：

```
{
  headers:{
    common:{
      ...
    },
    post:{
      ...
    }
    ...
  }
}
```

需要得是将所有 header 根据不同的方式合并到不同的 config 中去:(拍平)

```
{
  ...
}
```

> 至此合并策略逻辑完成。
> (axios.defaults 合并 axios(config))。

---

### 请求和响应配置

> 需求：官方的 axios 库 给默认配置添加了 transformRequest 和 transformResponse 两个字段，它们的值是一个数组或者是一个函数。

> 其中 transformRequest 允许你在将请求数据发送到服务器之前对其进行修改，这只适用于请求方法 put、post 和 patch，如果值是数组，则数组中的最后一个函数必须返回一个字符串或 FormData、URLSearchParams、Blob 等类型作为 xhr.send 方法的参数，而且在 transform 过程中可以修改 headers 对象。

> 而 transformResponse 允许你在把响应数据传递给 then 或者 catch 之前对它们进行修改。

> 当值为数组的时候，数组的每一个函数都是一个转换函数，数组中的函数就像管道一样依次执行，前者的输出作为后者的输入。

比如说：

```
axios({
  transformRequest: [(function(data) {
    return qs.stringify(data)
  }), ...axios.defaults.transformRequest],
  transformResponse: [axios.defaults.transformResponse, function(data) {
    if (typeof data === 'object') {
      data.b = 2
    }
    return data
  }],
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
})
```

### 扩展 Axios.create 静态接口

> 以上的所有逻辑都是基于 export axios 实例对象，全局拥有一个 axios 实例进行请求处理和响应处理。

需求:axios 都是一个单例，一旦修改了 axios 的默认配置，会影响所有的请求。希望提供了一个 axios.create 的静态接口允许我们创建一个新的 axios 实例，同时允许我们传入新的配置和默认配置合并，并做为新的默认配置。(axios.create 会继承默认 axios 所有默认配置)

比如：

```
const instance = axios.create({
  transformRequest: [(function(data) {
    return qs.stringify(data)
  }), ...(axios.defaults.transformRequest as AxiosTransformer[])],
  transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function(data) {
    if (typeof data === 'object') {
      data.b = 2
    }
    return data
  }]
})

instance({
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
})

```
