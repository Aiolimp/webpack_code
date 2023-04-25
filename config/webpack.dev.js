const path = require('path'); // nodejs核心模块，专门用来处理路径问题

const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 所有配置文件只能在node.js环境下运行，采用的模块化都是commonJs模块化
module.exports = {
    // 入口
    entry: "./src/main.js", // 相对路径
    // 输出
    output: {
        // 所有文件的输出路径
        // 开发模式没有输出
        path: undefined,
        // 入口文件打包输出文件名
        filename: "static/js/main.js",
    },
    // 加载器
    module: {
        rules: [
            {
                // oneOf：每个文件只能被其中一个loader配置处理
                oneOf: [
                    // loader的配置
                    {
                        test: /\.css$/i, // 只检测.css文件
                        // loader: 'xxx' // 只能使用一个loader
                        use: [ // 执行顺序：从右到左（从上到下）,use可以使用多个loader
                            "style-loader", // 将js中css通过创建style标签添加到html文件中生效
                            "css-loader" // 将css资源编译成commonjs的模块到js中
                        ],
                    },
                    {
                        test: /\.less$/i,
                        use: [
                            'style-loader',
                            'css-loader',
                            'less-loader',// 将less编译成css
                        ],
                    },
                    {
                        test: /\.s[ac]ss$/i,
                        use: [
                            'style-loader',
                            'css-loader',
                            'sass-loader',// 将sass编译成css
                        ],
                    },
                    {
                        test: /\.stylus$/i,
                        use: [
                            'style-loader',
                            'css-loader',
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
    ],
    // 开发服务器: 不会输出资源，在内存中编译打包的
    devServer: {
        host: "localhost", // 启动服务器域名
        port: "3000", // 启动服务器端口号
        open: true, // 是否自动打开浏览器
        hot: true, // 热模块替换：在程序运行中，替换、添加或删除模块，而无需重新加载整个页面
    },
    // 模块
    mode: 'development',
    // 优点：打包编译速度快，只包含行映射
    // 缺点：没有列映射
    devtool: "cheap-module-source-map",

}