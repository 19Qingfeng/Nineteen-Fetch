import { isPlaneObject,deepMerge } from '../helpers/utlis'
import { AxiosRequestConfig } from '../types'

// 默认合并策略
function defaultStrat(val1: any, val2: any): any {
  return typeof val2 === 'undefined' ? val1 : val2
}

// 只采用val2
function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

// 复杂合并配置

const strats = Object.create(null)

const stratKeyFromVal2 = ['url', 'data', 'params']

stratKeyFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

function deepMergeStrat (val1:any,val2:any):any {
  if(isPlaneObject(val2)) {
    return deepMerge(val1,val2)
  }else if (typeof val2 !== 'undefined') {
    return val2
  }else if(isPlaneObject(val1)) {
    return deepMerge(val1)
  }else if (typeof val1 !== 'undefined') {
    return val1
  }
} 

const stratKeysDeepMerge = ['headers']

stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

// 合并两个config
export default function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig) {
  if (!config2) {
    config2 = {}
  }
  const config = Object.create(null)
  // 将config2中的值添加到config中 进行merge
  for (let key in config2) {
    mergeField(key)
  }
  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const strat = strats[key] || defaultStrat
    /*  
     虽然这里的key是从config1/config2中in出来的(AxiosRequestConfig中in出来的)
     但是定义key为string Ts无法正确推断运行时才能推断出来的值
     所里这里解决类型推断错误的办法是在AxiosRequestConfig中添加字符串索引类型(config:AxiosReqeustConfig增加字符串索引类型)
     */
    /* 
        config2进行的非空断言也是同理
        虽然逻辑内已经对于config2没传的话进行了一次polyfill一定是非undefined
        但是因为Ts无法推断运行时 所以会认为config2是 AxiosRequestCofnig ｜ undefined
        故 undefined[key] 会提示类型推断错误
        进行非空断言，因为我们已经确定执行到这一步config2一定不是空。
    */
    config[key] = strat(config1[key], config2![key])
  }

  return config
}
