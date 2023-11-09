const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader/lib/index.js");
const path = require("path");
const cdn = {
  css: [],
  js: [],
  ignore: [],
};
module.exports = {
  mode: process.env.NODE_ENV, // development  production // 通过cross-env 包指定环境变量  更具环境变量进行打包
  entry: {
    index: "./main.js",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    library: "finalModule", // 配合 打包格式使用
    libraryTarget: "umd", // 打包格式
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": path.resolve(__dirname, "./src"),
    },
  },
  performance: {
    hints: false,
    // maxEntrypointSize: 5000000,
    // maxAssetSize: 30000000
  },
  module: {
    rules: [
      // {
      //   test: /\.vue$/,
      //   use: "vue-loader",
      // },
      {
        test: /.vue$/,
        loader: ["vue-loader"],
        // include: /node_modules/,
      },
      {
        test: /\.css|\.less/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /.(eot|ttf|svg|woff|woff2)$/,
        use: {
          loader: "file-loader",
        },
      },
      {
        test: /\.(gif|png|jpe?g)(\?\S*)?$/,
        loader: "url-loader",
      },
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: "/node_modules/",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "测试", // 打包后的title
      template: "./index.html", // 模板文件
      cdnConfig: cdn, // cdn配置
      onlyCss: false,
      externals: [], // 配置不需要参与打包的模块
      assetsPublicPath: "./",
    }),
    new VueLoaderPlugin(), // VueLoaderPlugin主要就是在处理rule
  ],
  devServer: {
    allowedHosts: ".csb.app",
  },
};
