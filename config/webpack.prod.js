const path = require('path'); // nodejs核心模块，专门用来处理路径问题
// nodejs核心模块，直接使用
const os = require("os");


const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
// 所有配置文件只能在node.js环境下运行，采用的模块化都是commonJs模块化

// cpu核数
const threads = os.cpus().length;

function getStyleLoader(pre) {
    return [
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
        pre,
    ].filter(Boolean)
}

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
            {
                // oneOf：每个文件只能被其中一个loader配置处理
                oneOf: [
                    // loader的配置
                    {
                        test: /\.css$/i, // 只检测.css文件
                        // loader: 'xxx' // 只能使用一个loader
                        use: getStyleLoader(), // 执行顺序：从右到左（从上到下）,use可以使用多个loader
                    },
                    {
                        test: /\.less$/i,
                        use: getStyleLoader('less-loader'),
                    },
                    {
                        test: /\.s[ac]ss$/i,
                        use: getStyleLoader('sass-loader'),
                    },
                    {
                        test: /\.stylus$/i,
                        use: getStyleLoader('stylus-loader'),
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
                        // exclude: /node_modules/, // 排除node_modules代码不编译
                        include: path.resolve(__dirname, "../src"), // 也可以用包含

                        // options: {
                        //     presets: ['@babel/preset-env']
                        // }
                        use: [
                            {
                                loader: "thread-loader", // 开启多进程
                                options: {
                                    workers: threads, // 数量
                                },
                            },
                            {
                                loader: 'babel-loader',
                                options: {
                                    cacheDirectory: true, // 开启babel编译缓存
                                    cacheCompression: false, // 缓存文件不要压缩
                                    plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
                                },
                            }
                        ]

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
            context: path.resolve(__dirname, '../src'),
            exclude: "node_modules", // 默认值
            cache: true, // 开启缓存
            // 缓存目录
            cacheLocation: path.resolve(
                __dirname,
                "../node_modules/.cache/.eslintcache"
            ),
            threads, // 开启多进程
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
        // css压缩
        // new CssMinimizerPlugin(),
        new PreloadWebpackPlugin({
            rel: "preload", // 告诉浏览器立即加载资源。 preload兼容性更好 
            as: "script",
            // rel: 'prefetch' // 告诉浏览器在空闲时才开始加载资源 prefetch兼容性更差
          }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            // css压缩也可以写到optimization.minimizer里面，效果一样的
            new CssMinimizerPlugin(),
            // 当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
            new TerserPlugin({
                parallel: threads // 开启多进程
            }),
            // 压缩图片
            // new ImageMinimizerPlugin({
            //     minimizer: {
            //         implementation: ImageMinimizerPlugin.imageminGenerate,
            //         options: {
            //             plugins: [
            //                 ["gifsicle", { interlaced: true }],
            //                 ["jpegtran", { progressive: true }],
            //                 ["optipng", { optimizationLevel: 5 }],
            //                 [
            //                     "svgo",
            //                     {
            //                         plugins: [
            //                             "preset-default",
            //                             "prefixIds",
            //                             {
            //                                 name: "sortAttrs",
            //                                 params: {
            //                                     xmlnsOrder: "alphabetical",
            //                                 },
            //                             },
            //                         ],
            //                     },
            //                 ],
            //             ],
            //         },
            //     },
            // }),
        ],
    },
    // 代码分割配置
    splitChunks: {
        chunks: "all", // 对所有模块都进行分割
        // 其他内容用默认配置即可
      },
    // 模块
    mode: 'production', // 生产模式自动开启html和JS压缩
    // 它会生成一个 xxx.map 文件，里面包含源代码和构建后代码每一行、每一列的映射关系。当构建后代码出错了，会通过 xxx.map 文件，
    // 从构建后代码出错位置找到映射后源代码出错位置，从而让浏览器提示源代码文件出错位置，帮助我们更快的找到错误根源。
    // 优点：包含行/列映射
    // 缺点：打包编译速度更慢
    devtool: "source-map",

}