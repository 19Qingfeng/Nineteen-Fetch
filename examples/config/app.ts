import axios from '../../src/index'
import qs from 'qs'

axios.defaults.headers.common['test2'] = 123

axios({
  url: '/config/post',
  method: 'post',
  data: qs.stringify({
    a: 1
  }),
  headers: {
    test: '321'
  }
}).then((res) => {
  console.log(res.data)
})

/* 
  axios.defaults.headers设置为null
  processHeaders中的normazilerHeader边界处理 直接return null(headers)
  flattenHeaders()边界处理headers(null)
  进入xhr函数
  边界没有处理 xhr 中Object.keys(null) TypeError
  需要额外处理的是transformHeaders函数处理了结构默认headers为{}但是null并不会走默认值  undefined才会走默认值 
*/
axios.defaults.headers = null

axios({
  url: '/config/post',
  method: 'post',
  data: qs.stringify({
    a: 1
  }),
  // headers: {
  //   test: '321'
  // }
}).then((res) => {
  console.log(res.data)
})