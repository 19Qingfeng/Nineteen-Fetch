const cookie = {
  read(name: string): string | null {
    // 从document.cookie中取哦
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
    // 因为是用字符串创建的reg 所以字符串中\\是对特殊字符的转义\
    // \\ 在字符串中是为了转义 \，因为用字符串去创建正则表达式，所以特殊字符需要先转义
    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie