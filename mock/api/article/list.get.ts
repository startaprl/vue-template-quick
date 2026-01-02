export default defineEventHandler(async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    code: 200,
    msg: 'success',
    data: [
      { id: 1, title: 'Vue3 教程' },
      { id: 2, title: 'TypeScript 教程' },
    ],
  }
})
