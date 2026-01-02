export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  return {
    code: 200,
    msg: 'success',
    data: {
      id,
      title: `文章${id}`,
      content: `这是文章${id}的内容`,
    },
  }
})
