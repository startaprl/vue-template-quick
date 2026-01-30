/**
 * 设置页面标题工具函数
 * @param pageTitle 页面标题（路由meta中的标题）
 * @param defaultTitle 全局默认标题，可选，默认值：'默认项目名称'
 */

export function setPageTitle(pageTitle?: string, defaultTitle = '淘金客'): void {
  const finalTitle = pageTitle || defaultTitle
  document.title = finalTitle
}
