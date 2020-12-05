import { type } from 'os'

const toString = Object.prototype.toString

export function isPlaneObject(data: any): data is Object {
  return toString.call(data) === '[object Object]'
}

export function isDate(data: any): data is Date {
  return toString.call(data) === '[object Date]'
}

export function isFormData(data:any): data is FormData {
  return data instanceof FormData
}

export function extend<T, U>(to: U, from: T): T & U {
  for (let key in from) {
    // 断言to是T和U联合类型 所以这里to可以存在U上的key值
    ;(to as T & U)[key] = from[key] as any
  }
  // 断言to是T&U 否则会认定to为T
  return to as T & U
}

// utils 抽离 抽象公用合并+深拷贝逻辑
// 深拷贝可以用
// 同样对象合并也可以用(合并default配置和传入的config，合并common，对应method和用户传入的headers对象合并)
// 合并+拷贝逻辑 传入参数依次
// 1. 深拷贝
// 2. 后传入的存在key(普通数据类型进行覆盖，对象进行合并)
export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)
  objs.forEach(obj => {
    if (obj) {
      // Object.keys ES2015之后对于非引用类型也可以使用并不会报错
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlaneObject(val)) {
          if (isPlaneObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge({}, val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })

  return result
}
