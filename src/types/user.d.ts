interface BasicUserInfo {
  avatar: string // 头像
  realName: string // 用户昵称
  roles?: string[] // 用户角色
  userId: string // 用户id
  username: string // 用户名
}

/** 用户信息 */
interface UserInfo extends BasicUserInfo {
  desc: string // 用户描述
  homePath: string // 首页地址
  token: string // accessToken
}

export type { UserInfo }
