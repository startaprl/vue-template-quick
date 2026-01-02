interface User {
  id: number
  name: string
  age: number
}
interface Article {
  id: number
  title: string
  content: string
}

interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

export type { ApiResponse, Article, User }
