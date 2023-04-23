## webpack

### entry

**作用：**配置入口文件的。

entry值的类型有三种，**string、string 数组、对象**。不同的类型，构建出来的模块依赖图各不相同:

- **string** 单页面单入口文件打包，会构建一个模块依赖图，入口只有一个；
- **string[],** 单页面多入口文件打包，会构建一个模块依赖图，入口只有一个；
- **object**多页面(多入口/单入口文件)打包，会构建多个(或者 1 个)模块依赖图，入口有多个；

**webpack默认只支持js和json文件作为入口文件，因此如果引入其他类型文件会报错。**

### resolve

**作用：**配置源文件、第三方依赖包如何被解析，得到文件的绝对路径。

- **resolve.alias：**通过配置别名解析路径。

```js
'vue$': 'vue/dist/vue.runtime.esm.js' // 末尾添加 $，以表示精准匹配
'@': path.resolve(__dirname, '../src')
```

- **resolve.extensions ：**扩展配置。

```js
extensions: ['*', '.js', '.json', '.vue']  
```

### module

**作用：**配置各个类型的源文件对应的 loader。

Loader 在 module.rules 中配置，作为模块的解析规则，类型为数组。每一项都是一个 Object，内部包含了 test(类型文件)、loader、options (参数)等属性。

在构建模块依赖图时，**loader**会将源文件中各种类型的源文件，如 tsx、ts、jsx、vue、less、sass 等，转换成浏览器可以支持的 js、css等类型。

通常我们会在 module.rules配置一系列规则，指定每种类型的文件，使用什么样的 `loader`。

**loader本质上是一个函数，它的入参是代码字符串，返回的结果也是一个代码字符串**。如果一个源文件需要多个 loader来处理，那么 loader 的使用是有先后顺序的。如处理 scss类型的文件，使用 loader的先后顺序为 sass-loader、css-loader、style-loader，上一次 loader的处理结果会做为下一个 `loader` 的入参。

Webpack 完成源文件绝对路径的解析以后，会根据解析出来的绝对路径去读取源文件的内容，然后作为入参传递给 `loader` 函数。`loader` 处理完以后会返回新的代码字符串，传递给下一个 `loader` 函数或者 `parser` 解析器。

`loader` 转换，是 `Webpack` 打包构建时间久的原因之一。

当 `parser` 收到 `loader` 转换以后的内容以后，会将内容转换为一个 `AST` 对象，分析并收集源文件的依赖，然后对收集到的依赖继续做路径解析、内容读取、内容转换、依赖解析。这一套流程会一直持续到项目涉及的所有源文件都解析完成，构建出一个模块依赖图。

构建好的模块依赖图，各个模块之间是静态依赖还是动态依赖、各个模块的 `export` 是否有被使用都一清二楚。

### optimization(优化)

模块依赖图构建完成以后，接下来要做的就是将模块依赖图拆分为多个 `bundle`。

这一过程，可以分成 **4**个步骤:

1. 对模块依赖图做预处理 **tree shaking**；
2. 初次分离，将模块依赖图分离为 **initial chunk**和 **async chunks**；
3. 二次分离，分离 **common chunks**、**runtime chunk**、**custome chunks**；
4. 构建 bundles；

**optimization** 提供了很多配置项来指导 Webpack做更好的完成上面四个步骤。

### output

**作用：**用于配置 webpack如何输出 bundle 内容, 包括确定 bundle文件名、指定输出位置、如何对外暴露变量等，是 Webpack 打包构建的最后一环。

- **path：**指定输出目录。
- **filename：**指定输出的文件名称。（[name].[hash:8].js）

### plugins

### cache

`cache`，缓存生成的 webpack 模块和 chunk，来改善构建速度。

`cache` 会在开发模式被设置成 `type: 'memory'` 而且在生产模式中被禁用。 `cache: true` 与 `cache: { type: 'memory' }` 配置作用一致。 传入 `false` 会禁用缓存。

当将 `cache.type` 设置为 `'filesystem'` 是会开放更多的可配置项。

### externals

配置 Webpack 选择不参与打包构建的资源，可有效提升打包构建速度和减小 bundle体积。

```js
module.exports = {
  //...
  externals: {
    jquery: 'jQuery',
  },
};
```

### mode

配置 Webpack 的工作模式

### devtool

配置 `Webpack` 在是否在打包过程中生成 `.map` 文件和生成什么样的 `.map` 文件。`.map` 文件不仅可以在本地开发时帮助我们调试源文件代码，还可以在线上环境出现问题时帮助我们快速定位问题出现在源文件的哪个位置，非常有用。

devtool有很多种配置规则，只有 `devtool` 中包含 `source-map` 关键字，才会生成 `.map` 文件;常用的有：

`cheap-module-source-map`，生成只有行映射、没有列映射的 `.map` 文件，调试时 `bundle` 代码可以映射到源文件;

`source-map`, 生成包含行映射、列映射的 `.map` 文件，调试时 `bundle` 代码会映射到转换之前的代码;

`cheap-source-map`,  生成只有行映射、没有列映射的 `.map` 文件，调试时 `bundle` 代码会映射到转换之前的代码;

`eval-nosources-cheap-source-map`, 以 `eval` 包裹模块代码 ，且 `.map` 映射文件中不带源码,也不带列映射;

开发模式下，常用的配置项为 `cheap-module-source-map`、 `cheap-module-eval-source-map`。

### devServer

开发模式下，我们会启动一个本地服务 `webpack-dev-server` 来进行本地开发，而 `devServer` 配置项就是用来指引 `wepack-dev-server` 工作的。

`devServer` 中最受人关注的是 `HMR` 配置项。

要正常使用 `HRM` 功能，需要三个前置条件:

- `devServer.hot` 配置项为 `true`；
- 启用 `inline` 模式；
- 模块中必须声明 `module.hot.accept(url, callback)`;

这里有的小伙伴们可能会有疑惑，自己在本地开发的时候，源文件里面并没有声明 `module.hot.accept(url, callback)`，为什么 `HMR` 还是可以正常运行呢?

答案很简单。这是因为我们在使用 `react / vue` 开发项目时，会使用对应的 `loader` 处理源文件。处理过程中，`loader` 会给源文件自动添加 `module.hot.accept(url, callback)` 逻辑。这一点，大家可以打开浏览器的源代码自己去看看噢。