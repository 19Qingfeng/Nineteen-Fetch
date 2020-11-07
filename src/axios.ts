import Axios from './core/Axios'
import { AxiosInstance } from './types'
import { extend } from './helpers/utlis'
// 扩展接口本质其实就是将原本的aixos方法 拷贝Axios类的实例方法 最终调用的还是axios
function createInstance(): AxiosInstance {
  const context = new Axios()
  const instance = Axios.prototype.request.bind(context)

  /* 
    这里对于instance方法做了重载 基于Axios类的实例方法request支持接受两个参数(url,config)或者单个(config)参数。
    这里的AxiosInstance接口要求原型上的request方法仅支持一个参数
    所以本身类型推断是会报错的 这里在return instance的时候用了类型断言所以并不会类型推断报错
    最终达到的效果：
    直接调用axios 支持重载 ： AxiosInstance接口支持方法重载两种类型
    通过axios.request原型方法 ： 不支持重载。仅仅支持传入config。
  */

  extend(instance, context) // 合并

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

  return instance as AxiosInstance
}

const axios = createInstance()

export default axios
