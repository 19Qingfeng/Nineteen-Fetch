import axios from '../../src/index'

// axios({
//   url: '/extend/post',
//   method: 'post',
//   data: {
//     msg: 'hi'
//   }
// })

// axios.request({
//   url: '/extend/post',
//   method: 'post',
//   data: {
//     msg: 'hello'
//   }
// })

// axios.get('/extend/get')

// axios.options('/extend/options')

// axios.delete('/extend/delete')

// axios.head('/extend/head')

// axios.post('/extend/post', { msg: 'post' })

// axios.put('/extend/put', { msg: 'put' })

// axios.patch('/extend/patch', { msg: 'patch' })

// axios({
//   url: '/extend/post',
//   method: 'post',
//   data: {
//     msg: 'hi'
//   }
// })

// axios('/extend/post', {
//   method: 'post',
//   data: {
//     msg: 'hello'
//   }
// })

interface User {
  name:string,
  age:number
}

interface ResponseType<T> {
  message:string,
  result:T,
  code:number
}

function getUser<T>() {
  return axios.get<ResponseType<T>>('/extend/user')
  .then(res => {
    // 过滤拿到response中的data(此时还未添加拦截器)
    return res.data
  })
}

async function mockFetchUser() {
  const userInfo = await getUser<User>()
  // 正确的类型推断 result中存在name和age 且 对应格子的类型
  const age = userInfo.result.age
  console.log(age,'age') 
}

mockFetchUser()