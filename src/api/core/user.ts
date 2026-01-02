import { requestClient } from '#/api/request'

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get('api/user/list')
}

export async function addUserApi(params: { name: string }) {
  return requestClient.post('api/user/add', params)
}
