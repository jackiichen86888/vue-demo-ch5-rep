const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  
  // 1.配合 createWebHistory，設定絕對路徑 '/'
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  
  // 2. 正式環境關閉 SourceMap，提升編譯速度與保護程式碼
  productionSourceMap: false,

  // 3. (選擇性) 開發階段解決 API 跨域ปัญหา (CORS)
  devServer: {
    historyApiFallback: true, // 確保開發伺服器重整理不會 404
  }
})
