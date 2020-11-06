export function extend<T, U>(to: U, from: T): T & U {
  for (let key in from) {
    // 断言to是T和U联合类型 所以这里to可以存在U上的key值
    ;(to as T & U)[key] = from[key] as any
  }
  // 断言to是T&U 否则会认定to为T
  return to as T & U
}
