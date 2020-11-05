import axios from '../../src/index'
import { AxiosError } from '../../src/index'

axios({
  method: 'get',
  url: '/error/get1'
})
  .then(res => {
    console.log(res)
  })
  .catch((e: AxiosError) => {
    console.log(e.code, 'code')
    console.log(e.config, 'config')
    console.log(e.name, 'name')
    console.log(e.request, 'request')
    console.log(e.message, 'message')
    console.log(e.response,'response')
  })

axios({
  method: 'get',
  url: '/error/get'
})
  .then(res => {
    console.log(res)
  })
  .catch((e: AxiosError) => {
    console.log(e.code)
  })

setTimeout(() => {
  axios({
    method: 'get',
    url: '/error/get'
  })
    .then(res => {
      console.log(res)
    })
    .catch((e: AxiosError) => {
      console.log(e.code)
    })
}, 5000)

axios({
  method: 'get',
  url: '/error/timeout',
  timeout: 2000
})
  .then(res => {
    console.log(res)
  })
  .catch((e: AxiosError) => {
    console.log(e.code, 'code')
    console.log(e.config, 'config')
    console.log(e.name, 'name')
    console.log(e.request, 'request')
    console.log(e.message, 'message')
    console.log(e.response,'response')
  })
