const toString = Object.prototype.toString

export function isPlaneObject(data: any): data is object {
  return toString.call(data) === '[object Object]'
}

export function isDate(data: any): data is Date {
  return toString.call(data) === '[object Date]'
}
