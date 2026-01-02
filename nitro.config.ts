import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  // 将 mock 目录作为 Nitro 的源码目录，Nitro 会自动扫描该目录下的 api、routes 等文件夹
  srcDir: 'mock',
})
