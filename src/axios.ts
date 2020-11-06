import Axios from './core/Axios'
import { AxiosInstance } from './types'
import { extend } from './helpers/extend'
function createInstance(): AxiosInstance {
  const axios = new Axios()
  const request = Axios.prototype.request.bind(axios)

  extend(request, axios) // 合并

  /* 
    其实这里还有一种更加优雅的写法
    extend的思路是在axios也就是request方法上挂载axios实例原型上的所有方法
    可以使用proxy代替extend方法 但是缺点就是proxy在IE11中是没有polyfill的
    
    return new Proxy(request,{
        get(target,key) {
            if(key) {
                return axios[key]
            }
        }
    })
  */

  return request as AxiosInstance
}

const axios = createInstance()

export default axios
