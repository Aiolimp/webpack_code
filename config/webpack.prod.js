const path = require('path'); // nodejs核心模块，专门用来处理路径问题

const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 所有配置文件只能在node.js环境下运行，采用的模块化都是commonJs模块化
module.exports = {
    // 入口
    entry: "./src/main.js", // 相对路径
    // 输出
    output: {
        // 所有文件的输出路径
        // __dirname nodejs的一个变量，代表当前文件夹的文件目录
        path: path.resolve(__dirname, '../dist'), //绝对路径
        // 入口文件打包输出文件名
        filename: "static/js/main.js",
        clean: true, // 自动将上次打包目录资源清空
    },
    // 加载器
    module: {
        rules: [
            // loader的配置
            {
                test: /\.css$/i, // 只检测.css文件
                // loader: 'xxx' // 只能使用一个loader
                use: [ // 执行顺序：从右到左（从上到下）,use可以使用多个loader
                    MiniCssExtractPlugin.loader, // 提取css成单独文件
                    "css-loader", // 将css资源编译成commonjs的模块到js中
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    "postcss-preset-env", // 能解决大多数样式兼容性问题
                                ],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.less$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    "postcss-preset-env", // 能解决大多数样式兼容性问题
                                ],
                            },
                        },
                    },
                    'less-loader',// 将less编译成css
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    "postcss-preset-env", // 能解决大多数样式兼容性问题
                                ],
                            },
                        },
                    },
                    'sass-loader',// 将sass编译成css
                ],
            },
            {
                test: /\.stylus$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    "postcss-preset-env", // 能解决大多数样式兼容性问题
                                ],
                            },
                        },
                    },
                    'stylus-loader',// 将stylus编译成css
                ],
            },
            // 处理图片资源
            {
                test: /\.(png|jpe?g|gif|webp|svg)$/,
                type: "asset",// 相当于url-loader, 将文件转化成 Webpack 能识别的资源，同时小于某个大小的资源会处理成 data URI 形式
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024 // 小于10kb的图片会被base64处理,优点：减少请求数量 缺点：体积会更大
                    }
                },
                generator: {
                    // 将图片文件输出到 static/imgs 目录中
                    // 将图片文件命名 [hash:8][ext][query]
                    // [hash:8]: hash值取8位
                    // [ext]: 使用之前的文件扩展名
                    // [query]: 添加之前的query参数
                    filename: "static/imgs/[hash:8][ext][query]",
                },
            },
            // 处理字体图标,以及其他资源
            {
                test: /\.(ttf|woff2?|map4|map3|avi)$/,
                type: "asset/resource", // 相当于file-loader, 将文件转化成 Webpack 能识别的资源，其他不做处理
                generator: {
                    filename: "static/media/[hash:8][ext][query]",
                },
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/, // 排除node_modules代码不编译
                use: {
                    loader: 'babel-loader',
                    // options: {
                    //     presets: ['@babel/preset-env']
                    // }
                }
            }

        ]
    },
    // 插件
    plugins: [
        // plugins的配置
        new ESLintPlugin({
            // 检测那些文件
            context: path.resolve(__dirname, '../src')
        }),
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, "../public/index.html"),
        }),
        // 提取css成单独文件
        new MiniCssExtractPlugin({
            // 定义输出文件名和目录
            filename: "static/css/main.css",
        }),
    ],
    // 模块
    mode: 'production'

}