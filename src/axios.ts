import Axios from './core/Axios'
import { AxiosRequestConfig, AxiosStatic } from './types'
import { extend } from './helpers/utlis'
import defaultsConifg from './default'
import mergeConfig from './core/mergeConfig'
// 扩展接口本质其实就是将原本的aixos方法 拷贝Axios类的实例方法 最终调用的还是axios
function createInstance(defaultsConifg: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(defaultsConifg)
  const instance = Axios.prototype.request.bind(context)

  /* 
    -> 静态扩展create之前 createInstance方法返回axiosInstance类型 
    这里对于instance方法做了重载 基于Axios类的实例方法request支持接受两个参数(url,config)或者单个(config)参数。
    这里的AxiosInstance接口要求原型上的request方法仅支持一个参数
    所以本身类型推断是会报错的 这里在return instance的时候用了类型断言所以并不会类型推断报错
    最终达到的效果：
    直接调用axios 支持重载 ： AxiosInstance接口支持方法重载两种类型
    通过axios.request原型方法 ： 不支持重载。仅仅支持传入config。

    以上注释是错误的
    真实：实现兼容接口定义 不一定完全匹配(任一一种情况完全满足接口定义) 那么类型推断就会成功
    也就是说instance方法 interface虽然类型定义中(request)方法仅支持一个参数(AxiosRequestCofing类型)
    但是实际调用中 调用axios.request方法可以传入两个参数，都是any类型并且第二个参数是可选参数(可以不传递)
    就是说axios.request方法支持传入一个参数并且类型为any，这是完全兼容类型定义的。
    所以不会报错
    简单来说 
    axios类中request(url: any, config?: any)方法(存在仅传递一个any类型的参数情况)完全兼容匹配
    request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>类型定义
    (any是所有类型的子类型同时都是一个参数)
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

  return instance as AxiosStatic
}

const axios = createInstance(defaultsConifg)
axios.create = function(config) {
  return createInstance(mergeConfig(defaultsConifg, config))
}

export default axios
