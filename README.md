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

> Axios 合并配置，扩展功能完毕。

---

### 取消功能的设计和实现

#### 需求分析

> 需求：参照 Axios 官网的配置，从 axios 的取消接口设计层面，我们希望做如下的设计：

##### 第一种取消方式

```
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user/12345', {
  cancelToken: source.token
}).catch(function (e) {
  if (axios.isCancel(e)) {
    console.log('Request canceled', e.message);
  } else {
    // 处理错误
  }
});

// 取消请求 (请求原因是可选的)
source.cancel('Operation canceled by the user.');
```

给 axios 上添加一个 CancelToken 的对象，它拥有一个 source 方法返回一个 source 对象。source.token 是每次请求时传递给配置对象的 cancelToken 属性，然后在请求发出去之后可以通过 source.cancel 方法取消请求。

##### 第二种取消方式

```
const CancelToken = axios.CancelToken;
let cancel;

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    cancel = c;
  })
});

// 取消请求
cancel();
```

axios.CancelToken 是一个类，这里直接将实例化的类对象赋值给请求配置对象中的 cancelToken 属性，CancelToken 构造函数接受一个 excutor 方法，这个方法接受一个参数是取消函数 c。然后在 executor 内部拿到 c 并且将 c 赋值给 cancel，之后通过调用 cancel 进行取消。

#### 异步分离原则分析

经过需求分析，简单推断出:

axios 请求配置上需要额外添加一个 CancelToken 类，然后在外部调用 cancel 方法进行取消。

请求的发送是一个异步过程，最终执行的是 xhr.send 方法，MDN 上 xhr 对象提供了一个 abort 方法阻止请求的发送。因为 xhr 已经被封装在 axios 内部外部目前是无法直接触碰到 xhr 对象的。所以最终当外部执行 cancel 方法的时候实质上要在内部调用 xhr.abort 方法。

其实思路比较简单：在 xhr 异步发送请求中，插入一段代码。当外部执行 cancel 方法的时候内部插入这段代码进行执行从而调用 axios.abort 阻止请求。

所以决定用 Promise 进行异步分离，也就是在 CancelToken 对象中保存一个 pedding 状态 Promise 对象。然后当我们执行 cancel 方法的时候，能够访问到这个 Promise 对象，把它从 pending 状态变成 resolved 状态，这样我们就可以在 then 函数中去实现取消请求的逻辑，类似如下的代码：

```
if (cancelToken) {
  cancelToken.promise
    .then(reason => {
      request.abort()
      reject(reason)
    })
}
```

> 实际上通过需求分析得来 axios.CancelToken 是一个类，并且在初始化的时候接受一个 Fn，初始化立即执行 Fn 传入内部取消方法供外部调用取消就 ok。

> 并且异步分离原则，CancelToken 类上拥有一个内部控制的 Promise，当显式调用外部取消方法需要做到改变内部 Promise 状态从而执行 xhr 逻辑中的 then 方法从而处理 then 中取消的逻辑(通过闭包进行一系列访问):

1. xhr 逻辑中封装`axios.cancelToken.promise.then(/* 一系列处理取消发送逻辑 */)`，当 Promise 为 resolve 时执行。

2. 其次向外部传递 Promise 的 resolve 方法， 赋值给 cancel 方法体，外部调用取消方法体->就等于调用内部 Promise 的 resolve 方法，从而改变内部 Promise 状态执行 then 方法进行 xhr.abort。

##### 关于闭包，访问不属于自身作用域内的自由变量。有两点需要注意

1. 闭包中所谓的自由变量，不一定是变量，访问非自身作用域内的所有东西都算作闭包，包括函数。

2. 闭包中，函数中定义的函数可以访问到非自身作用域内的变量需要注意的是，闭包和 return 没有关系，return 函数只是闭包的一种实现方式而已，比如这个 cancelToken 中以参数形式传递的函数同样达到了闭包的效果访问到了 resolvePromise 这个自由函数去执行。

##### 关于函数的赋值，需要注意

1. 之前一直理解函数的赋值是基本类型的赋值仅仅赋值的是函数体 string，这个理解是不正确的。

函数的赋值是基于引用类型的赋值，就好比 cancelToken 类中的对于外部调用 cancel=c 这个赋值，其实就是基于引用类型的赋值才能实现的。

###### 实现 axios 的取消功能有两点这里特别强调下

1. 利用闭包特性，参数形式传递 function，外部调用该函数达到访问内部函数从而执行内部函数。

2. 利用函数的赋值引用类型，c = cancel，从而调用 cancel 相当于调用同样地址的 c 进行打包闭包效果。

3. 利用 Promise 特性，闭包调用到内部的 resolvePromise 函数从而改变 Promise 状态达到执行 xhr 中 then 的逻辑中断请求。

#### 谨记如下 Demo

```
 function moduleA() {
            const url = "hylink.com";
            let fn;
            moduleB(function(c) {
                fn = c;
            });
            fn();
        }

        function moduleB(fnn) {
            const url = "hycoding.com";

            function fn() {
                console.log(url);
            }
            const map = {
                a: fn,
            };
            fnn(map["a"]);
        }

        moduleA(); // hycoding.com
```

##### axios 这种设计思想非常 Nice 啊，学到了。！！！

#### axios 静态方法

> axios.isCancel 以及 axios.cancelToken 实现。

#### 额外逻辑处理

需求：对于一些请求携带的 cancelToken 已经被取消的情况下直接不发送请求(无意义)，处理成为抛出异常既可，异常的信息就是取消的原因。

> 解决方式：通过 request 请求配置中 cancelToken 的 reason 既可以进行判断。

> 需要注意的是不要直接在 core 中进行 if if 的判断了，模块化思维将是否发送抽象到 cancelToken 类方法中。

---

### withCredentials

需求:关于 withCredentials 可以参照下方我的文章解释。

[XHR 中的 withCredentials](https://juejin.cn/post/6897481750390587399/)

> 其实也就是当请求配置 xhr.withCredentials = true 那么该请求就可以支持发送跨域请求并且携带请求域的 cookie。只不过当携带 cookie 还会存在一些其他限制，比如 cookie 的 SameSite 属性。

有些时候我们会发一些跨域请求，比如 http://domain-a.com 站点发送一个 http://api.domain-b.com/get 的请求，默认情况下，浏览器会根据同源策略限制这种跨域请求，但是可以通过 CORS (opens new window)技术解决跨域问题。

> widthCredentials 在同源下(相同域下是无效的)，也就是相同域下都会请求写在 cookie。

在同域的情况下，我们发送请求会默认携带当前域下的 cookie，但是在跨域的情况下，默认是不会携带请求域下的 cookie 的，比如 http://domain-a.com 站点发送一个 http://api.domain-b.com/get 的请求，默认是不会携带 api.domain-b.com 域下的 cookie，如果我们想携带（很多情况下是需要的），只需要设置请求的 xhr 对象的 withCredentials 为 true 即可。

#### 需要注意的是设置了 xhr.withCredentials=true 后还需要额外注意 cookie 的 SameSite 属性。

##### Chrome80 后 SameSite 属性默认为 Lax，也就是不支持 demo 中的 post 请求携带跨域 cookie。

解决方式可以参照这篇文章[Chrome80 后关于 cookie 以及跨域携带 cookie](https://juejin.cn/post/6844904088165941262)。

> 其实可以这样理解：

xhr.withCredentials 表示跨域请求是否支持携带请求域 cookie(基础:开启支持跨域请求支持携带请求域 cookie)，

SameSite 可以看成再此基础上哪些方式被支持可以携带跨域 cookie(二级限制:开启后额外限制特定的请求方式可以携带跨域 cookie)。

### CSRF/XSRF

关于 CSRF 攻击方式和攻击远离以及防御策略可以参照我的这篇文章[大白话讲讲 CSRF 究竟是什么](https://juejin.cn/post/6897591924946993159/)。

> CSRF 的防御手段有很多，比如验证请求的 referer，但是 referer 也是可以伪造的，所以杜绝此类攻击的一种方式是服务器端要求每次请求都包含一个 token，这个 token 不在前端生成，而是在我们每次访问站点的时候生成，并通过 set-cookie 的方式种到客户端，然后客户端发送请求的时候，从 cookie 中对应的字段读取出 token，然后添加到请求 headers 中。这样服务端就可以从请求 headers 中读取这个 token 并验证，由于这个 token 是很难伪造的，所以就能区分这个请求是否是用户正常发起的。详细参见文章内容。

对于 ts-axios 库，我们要自动把这几件事做了，每次发送请求的时候，从 cookie 中读取对应的 token 值，然后添加到请求 headers 中。我们允许用户配置 xsrfCookieName 和 xsrfHeaderName，其中 xsrfCookieName 表示存储 token 的 cookie 名称，xsrfHeaderName 表示请求 headers 中 token 对应的 header 名称。

```
axios.get('/more/get',{
  xsrfCookieName: 'XSRF-TOKEN', // default
  xsrfHeaderName: 'X-XSRF-TOKEN' // default
}).then(res => {
  console.log(res)
})
```

我们提供 xsrfCookieName 和 xsrfHeaderName 的默认值，当然用户也可以根据自己的需求在请求中去配置 xsrfCookieName 和 xsrfHeaderName。

接下来我们要做三件事：

+ 首先判断如果是配置 withCredentials 为 true 或者是同域请求，我们才会请求 headers 添加 xsrf 相关的字段。

> 判断是否是同域请求可以通过一个工具函数，传入URL之后函数内部创建一个a标签URL赋值给href。之后通过a.host/a.protocol解析传入的URL的域名和协议。
> 通过传入的URL和window.location.href当前域名进行判断是否是同源。

+ 如果判断成功，尝试从 cookie 中读取 xsrf 的 token 值。

+ 如果能读到，则把它添加到请求 headers 的 xsrf 相关字段中。
