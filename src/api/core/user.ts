import { requestClient } from '#/api/request'

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get('/user/info')
}
