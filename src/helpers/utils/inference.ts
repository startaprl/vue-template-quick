import { isFunction, isObject, isString } from '@vue/shared'

/**
 * 检查传入的值是否为undefined。
 *
 * @param {unknown} value 要检查的值。
 * @returns {boolean} 如果值是undefined，返回true，否则返回false。
 */
function isUndefined(value?: unknown): value is undefined {
  return value === undefined
}

/**
 * 检查传入的值是否为boolean
 * @param value
 * @returns 如果值是布尔值，返回true，否则返回false。
 */
function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

/**
 * 检查传入的值是否为空。
 *
 * 以下情况将被认为是空：
 * - 值为null。
 * - 值为undefined。
 * - 值为一个空字符串。
 * - 值为一个长度为0的数组。
 * - 值为一个没有元素的Map或Set。
 * - 值为一个没有属性的对象。
 *
 * @param {T} value 要检查的值。
 * @returns {boolean} 如果值为空，返回true，否则返回false。
 */
function isEmpty<T = unknown>(value?: T): value is T {
  if (value === null || value === undefined) {
    return true
  }

  if (Array.isArray(value) || isString(value)) {
    return value.length === 0
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0
  }

  if (isObject(value)) {
    return Object.keys(value).length === 0
  }

  return false
}

/**
 * 检查传入的字符串是否为有效的HTTP或HTTPS URL。
 *
 * @param {string} url 要检查的字符串。
 * @return {boolean} 如果字符串是有效的HTTP或HTTPS URL，返回true，否则返回false。
 */
function isHttpUrl(url?: string): boolean {
  if (!url) {
    return false
  }
  // 使用正则表达式测试URL是否以http:// 或 https:// 开头
  const httpRegex = /^https?:\/\/.*$/
  return httpRegex.test(url)
}

/**
 * 检查传入的值是否为数字
 * @param value
 */
function isNumber(value: any): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export {
  isBoolean,
  isEmpty,
  isFunction,
  isHttpUrl,
  isNumber,
  isObject,
  isString,
  isUndefined,
}
