import { get, post } from '#/api'

// 定义接口返回数据类型
interface UserInfo {
  id: number
  username: string
  avatar: string
  roles: string[]
}

/**
 * 获取用户信息
 */
export function getUserInfo(): Promise<UserInfo> {
  return get<UserInfo>('/user/info')
}

/**
 * 登录
 * @param username 用户名
 * @param password 密码
 */
export function login(username: string, password: string): Promise<{ token: string }> {
  return post<{ token: string }>('/user/login', { username, password })
}
