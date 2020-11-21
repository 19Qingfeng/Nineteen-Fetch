import axios from '../../src/index'

document.cookie = 'a=b'

// 当前域下的请求
axios
  .get('/more/get')
  .then(res => {
    console.log(res)
  })
  .catch(e => {
    // nothing
  })

// 发送跨域请求8088端口 server2.js
// https://juejin.cn/post/6844904088165941262 参照这篇文章
axios
  .post(
    'http://127.0.0.1:8088/more/server2',
    {},
    {
      withCredentials: true
    }
  )
  .then(res => {
    console.log(res)
  })
  .catch(e => {
    // nothing
  })
