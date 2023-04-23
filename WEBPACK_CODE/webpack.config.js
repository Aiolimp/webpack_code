const path = require('path'); // nodejs核心模块，专门用来处理路径问题
// 所有配置文件只能在node.js环境下运行，采用的模块化都是commonJs模块化
module.exports = {
    // 入口
    entry: "./src/main.js", // 相对路径
    // 输出
    output: {
        // 文件的输出路径
        // __dirname nodejs的一个变量，代表当前文件夹的文件目录
        path: path.resolve(__dirname, 'dist'), //绝对路径
        // 文件名
        filename: "main.js",
    },
    // 加载器
    module: {
        rules: [
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
            {
                test: /\.(png|jpe?g|gif|webp|svg)$/,
                type: "asset",
                parser: {
                  dataUrlCondition: {
                    maxSize: 10 * 1024 // 小于10kb的图片会被base64处理,优点：减少请求数量 缺点：体积会更大
                  }
                }
              },
        ]
    },
    // 插件
    plugins: [
        // plugins的配置

    ],
    // 模块
    mode: 'development'

}