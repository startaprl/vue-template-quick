export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return {
    code: 200,
    msg: `添加用户 ${body.name} 成功`,
    data: { id: 3, ...body },
  }
})
