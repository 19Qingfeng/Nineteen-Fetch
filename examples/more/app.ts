import axios from '../../src/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { stat } from 'fs'
import qs from 'qs'

// document.cookie = 'a=b'

// // 当前域下的请求
// axios
//   .get('/more/get')
//   .then(res => {
//     console.log(res)
//   })
//   .catch(e => {
//     // nothing
//   })

// // 发送跨域请求8088端口 server2.js
// // https://juejin.cn/post/6844904088165941262 参照这篇文章
// axios
//   .post(
//     'http://127.0.0.1:8088/more/server2',
//     {},
//     {
//       withCredentials: true
//     }
//   )
//   .then(res => {
//     console.log(res)
//   })
//   .catch(e => {
//     // nothing
//   })

// const instance = axios.create({
//   xsrfCookieName: 'XSRF-TOKEN-D',
//   xsrfHeaderName:'X-XSRF-TOKEN-D'
// })

// instance.get('/more/get').then(res => {
//   console.log(res)
// })
//   .catch(e => {
//   console.log(e)
// })

// const instance = axios.create()

// function calculatePercentage(loaded: number, total: number) {
//   return Math.floor(loaded * 1.0) / total
// }

// function loadProgressBar() {
//   const setupStartProgress = () => {
//     instance.interceptors.request.use(config => {
//       NProgress.start()
//       return config
//     })
//   }

//   const setupUpdateProgress = () => {
//     const update = (e: ProgressEvent) => {
//       console.log(e)
//       NProgress.set(calculatePercentage(e.loaded, e.total))
//     }
//     instance.defaults.onDownloadProgress = update
//     instance.defaults.onUploadProgress = update
//   }

//   const setupStopProgress = () => {
//     instance.interceptors.response.use(
//       response => {
//         NProgress.done()
//         return response
//       },
//       error => {
//         NProgress.done()
//         return Promise.reject(error)
//       }
//     )
//   }

//   setupStartProgress()
//   setupUpdateProgress()
//   setupStopProgress()
// }

// loadProgressBar()

// const downloadEl = document.getElementById('download')

// downloadEl!.addEventListener('click', e => {
//   instance.get('https://img.mukewang.com/5cc01a7b0001a33718720632.jpg')
// })

// const uploadEl = document.getElementById('upload')

// uploadEl!.addEventListener('click', e => {
//   const data = new FormData()
//   const fileEl = document.getElementById('file') as HTMLInputElement
//   if (fileEl.files) {
//     console.log(fileEl.files[0], 'files')
//     data.append('file', fileEl.files[0])

//     instance.post('/more/upload', data)
//   }
// })

// axios.post('/more/post', {
//   a: 1
// }, {
//   auth: {
//     username: 'Yee',
//     password: '123456'
//   }
// }).then(res => {
//   console.log(res)
// })

// axios.post('/more/post',{
//   a:'1'
// },{
//   auth:{
//     username:'wanghaoyu',
//     password:'wanghaoyu'
//   }
// }).then(res => console.log(res))
// .catch(e => console.error(e))

// axios.get('/more/304').then(res => {
//   console.log(res,'res+304+noConfig')
// }).catch(e => {
//   console.log(e,'304 noconfig')
// })

// axios.get('/more/304',{
//   validateStatus:(status) => {
//     return status >= 200 && status < 400
//   }
// })
// .then(res => {
//   console.log(res,'res+304+config')
// })

// axios
//   .get('/more/get', {
//     params: new URLSearchParams('a=b&c=d')
//   })
//   .then(res => {
//     console.log(res)
//   })

// axios
//   .get('/more/get', {
//     params: {
//       a: 1,
//       b: 2,
//       c: ['a', 'b', 'c']
//     }
//   })
//   .then(res => {
//     console.log(res)
//   })

// const instance = axios.create({
//   paramsSerializer(params) {
//     return qs.stringify(params, { arrayFormat: 'brackets' })
//   }
// })

// instance
//   .get('/more/get', {
//     params: {
//       a: 1,
//       b: 2,
//       c: ['a', 'b', 'c']
//     }
//   })
//   .then(res => {
//     console.log(res)
//   })

const instance = axios.create({
  baseURL: 'https://img.mukewang.com/'
})

instance.get('5cc01a7b0001a33718720632.jpg')

instance.get('https://img.mukewang.com/szimg/5becd5ad0001b89306000338-360-202.jpg')

