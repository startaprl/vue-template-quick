export default defineEventHandler(() => {
  return {
    code: 200,
    msg: 'success',
    data: [
      { id: 1, name: '张三', age: 20 },
      { id: 2, name: '李四', age: 22 },
    ],
  }
})
