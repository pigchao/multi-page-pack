const webpack = require('webpack');
const HappyPack = require('happypack');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const webpackJson = require('./src/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const buildReactConfigs = require('./webpack.react');
const buildVueConfigs = require('./webpack.vue');
const buildJQueryConfigs = require('./webpack.jquery');
const AssetsPlugin = require('assets-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = require('./loader/pre-render/');

const cdnPath = "https://cdn.xxxx.com/page/";
const localePath = "/";
const enableHappyPack = process.env.DISABLE_HAPPYPACK !== 'true';
const publicRootPath = process.env.STATIC_PATH !== 'cdn' ? localePath : cdnPath;
const supportLanguage = ['en', 'zh'];
const getPort = (() => {
  let port = 50500;
  return () => {
    return port++;
  }
})();

const buildEntry = (projectCurrent, projectName) => {
  let entry = {};
  try {
    let filePath = path.join(__dirname, `src/client/${projectCurrent}`);
    let files = fs.readdirSync(filePath);
    files.forEach(filename => {
      let stat = fs.statSync(path.join(filePath, filename));
      if (stat.isFile()) {
        let fileParse = path.parse(filename);
        if (!/\.(ts|tsx)/.test(fileParse.ext)) {
          return;
        }
        if (process.env.NET_ENV === 'development') {
          entry[`${projectName}/${fileParse.name}`] = [path.join(filePath, filename), 'webpack/hot/dev-server', `webpack-dev-server/client?http://0.0.0.0:${config.port}/`];
        } else {
          entry[`${projectName}/${fileParse.name}`] = path.join(filePath, filename);
        }
      }
    });
    return entry;
  } catch (e) {
    console.error('buildEntry Error', e);
  }
};

const buildI18nHtmlPlugin = (projectCurrent, projectName, name) => {
  if(!fs.existsSync(path.join(__dirname, `src/client/${projectCurrent}/${name}.ejs`))){
    throw new Error('webpack i18n just support ejs template');
  }
  let tpl = path.join(__dirname, `src/client/${projectCurrent}/${name}.ejs`);
  return supportLanguage.map(language => {
    //i18n 默认取当前项目 ./assets/resource/zh.ts, ./assets/resource/us.ts 文件进行预编译
    let resourcePath = path.join(__dirname, `src/client/${projectCurrent}/assets/resource/${language}.ts`);
    if(!fs.existsSync(resourcePath)){
      throw new Error(`i18n resource file not exists, ${resourcePath}`);
    }
    return new HtmlWebpackPlugin({
      filename: `${projectName}/${name}_${language}.html`,
      favicon: path.join(__dirname, 'src/client/favicon.png'),
      template: `html-loader!${require.resolve('./loader/pre-loader')}?resource=${resourcePath}!${tpl}`,
      minify: process.env.NET_ENV !== 'production' && process.env.NET_ENV !== 'preview' ? null :{
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true
      },
      chunks: [`${projectName}/${name}`]
    });
  })
};

const buildCommonHtmlPlugin = (projectCurrent, projectName, name) => {
  let tpl = path.join(__dirname, 'src/client/app.html'); //Fallback html template
  if (fs.existsSync(path.join(__dirname, `src/client/${projectCurrent}/${name}.html`))) {  //如果有跟入口文件同名的html模板，则优先取同名html模板
    tpl = path.join(__dirname, `src/client/${projectCurrent}/${name}.html`);
  } else if (fs.existsSync(path.join(__dirname, `src/client/${projectCurrent}/app.html`))) {  //如果项目下有app.html，则优先取项目app.html模板
    tpl = path.join(__dirname, `src/client/${projectCurrent}/app.html`);
  }
  return new HtmlWebpackPlugin({
    filename: `${projectName}/${name}.html`,
    favicon: path.join(__dirname, 'src/client/favicon.png'),
    template: tpl, //取DLL打包之后的文件作为模板
    minify: process.env.NET_ENV !== 'production' && process.env.NET_ENV !== 'preview' ? null :{
      removeComments: true,
      collapseWhitespace: true,
      minifyJS: true,
      minifyCSS: true
    },
    chunks: [`${projectName}/${name}`]
  });
};

const buildCommonPlugins = (projectCurrent, projectName) => {
  let commonPlugin = [
    new webpack.DefinePlugin({
      'process.env': {
        NET_ENV: process.env.NET_ENV ? JSON.stringify(process.env.NET_ENV) :JSON.stringify('development'),
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh/),
  ];
  if(enableHappyPack){
    commonPlugin.push(new HappyPack({
      id: 'js',
      loaders: [
        {
          loader: "babel-loader"
        },
        {
          loader: 'ts-loader',
          appendTsSuffixTo: [/\.vue$/],
          options: {
            configFile: path.resolve(__dirname, './tsconfig.json'),
            transpileOnly: true,
            experimentalWatchApi: true,
            happyPackMode: true,
          },
        }
      ]
    }))
  }
  if (process.env.NET_ENV === 'development') {
    commonPlugin.push(new webpack.HotModuleReplacementPlugin());
  } else {
    commonPlugin.push(new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[hash].css',
      chunkFilename: '[id].[chunkhash].css',
    }));
  }
  let filePath = path.join(__dirname, `src/client/${projectCurrent}`);
  let files = fs.readdirSync(filePath);
  let preRenderFiles = [];
  files.forEach(filename => {
    let stat = fs.statSync(path.join(filePath, filename));
    if (stat.isFile()) {
      let fileParse = path.parse(filename);
      if (!/\.(ts|tsx)/.test(fileParse.ext)) {
        return;
      }
      let name = path.parse(filename).name;
      let fileWebpackConfig = webpackJson && (webpackJson[`${projectName}/${name}`] || webpackJson[`${projectName}/**`]);
      if(fileWebpackConfig && fileWebpackConfig.i18n){
        commonPlugin.unshift(...buildI18nHtmlPlugin(projectCurrent, projectName, name));
      }else{
        commonPlugin.unshift(buildCommonHtmlPlugin(projectCurrent, projectName, name));
      }
      if(fileWebpackConfig && fileWebpackConfig.preRender){
        preRenderFiles.push(`${projectName}/${name}.html`);
      }
    }
  });
  if(preRenderFiles.length > 0 && process.env.NET_ENV !== 'development'){
    commonPlugin.push(new PrerenderSPAPlugin({
      // Required - The path to the webpack-outputted app to prerender.
      staticDir: path.join(__dirname, 'dist/client'),

      // Optional - The path your rendered app should be output to.
      // (Defaults to staticDir.)
      outputPath: path.join(__dirname, 'dist/client'),

      // Optional - The location of index.html
      // indexPath: path.join(__dirname, 'dist/client', '/thanksgiving/main.html'),

      // Required - Routes to render.
      routes: preRenderFiles,

      server: {
        port: getPort()
      },

      // Optional - Uses html-minifier (https://github.com/kangax/html-minifier)
      // To minify the resulting HTML.
      // Option reference: https://github.com/kangax/html-minifier#options-quick-reference
      minify: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        keepClosingSlash: true,
        sortAttributes: true,
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
      },
      // The actual renderer to use. (Feel free to write your own)
      // Available renderers: https://github.com/Tribex/prerenderer/tree/master/renderers
      renderer: new Renderer({
        // Optional - Wait to render until a certain amount of time has passed.
        // NOT RECOMMENDED
        renderAfterTime: 5000, // Wait 5 seconds.

        headless: true,

        inject: true,

        //Interception public url, then replace by locale url
        dealWithRequest: (req, baseUrl) => {
          let url = req.url();
          if(url.indexOf(cdnPath) > -1){
            url = `${baseUrl}${url.replace(cdnPath, localePath)}`;
            // console.log(`url`, url);
            return { url }
          }
        }
      })
    }))
  }

  return commonPlugin;
};

const buildCommonRules = (projectName) => {
  return [
    {
      test: /\.(ts|tsx)$/,
      exclude: [path.resolve(__dirname, "node_modules")],
      ...(
        enableHappyPack ?
          {
            use: 'happypack/loader?id=js'
          } : {
            loaders: [
              {
                loader: "babel-loader"
              },
              {
                loader: 'ts-loader',
                options: {
                  configFile: path.resolve(__dirname, './tsconfig.json'),
                  appendTsSuffixTo: [/\.vue$/]
                },
              }
            ],
          }
      )
    },
    {
      test: /\.(less)$/,
      use: [
        process.env.NET_ENV !== 'development' ? MiniCssExtractPlugin.loader :{loader: 'style-loader'},
        {loader: 'css-loader?-minimize'},
        {
          loader: 'postcss-loader', options: {
            plugins: function () {
              return [require('postcss-cssnext'), require('postcss-flexbugs-fixes')];
            }
          }
        },
        {loader: 'less-loader'}
      ]
    },
    {
      test: /\.(css)$/,
      use: [
        process.env.NET_ENV !== 'development' ? MiniCssExtractPlugin.loader :{loader: 'style-loader'},
        {loader: 'css-loader?-minimize'},
        {
          loader: 'postcss-loader', options: {
            plugins: function () {
              return [require('postcss-cssnext'), require('postcss-flexbugs-fixes')];
            }
          }
        },
      ]
    },
    {
      test: /\.(png|jpg|jpeg|gif|svg|ttf|eot|otf|woff|woff2|mp4)$/,
      loader: `url-loader?limit=8192&name=${projectName}/[hash].[ext]`,
    },
  ];
};

const buildConfig = (projectCurrent) => {
  let arr = projectCurrent.split('/');
  /**
   * 不同的目录下使用不同的框架技术，分别是React, Vue, jQuery, 无（Pure）
   */
  if(['react', 'vue', 'jquery', 'pure'].indexOf(arr[0]) === -1){
    throw new Error(`Unknown tech: ${arr[0]}`);
  }
  let tech = arr[0];
  let projectName = arr.slice(1).join('/');
  let entry = buildEntry(projectCurrent, projectName);
  let commonPlugins = buildCommonPlugins(projectCurrent, projectName);
  let commonRules = buildCommonRules(projectName);

  let configs;
  if (tech === 'react') {
    configs = buildReactConfigs();
  } else if (tech === 'vue') {
    configs = buildVueConfigs();
  } else if (tech === 'jquery') {
    configs = buildJQueryConfigs();
  } else if (tech === 'pure') {
    configs = {};
  }else{
    throw new Error(`Unknown project path: ${projectCurrent}, ${tech}`);
  }

  let {rules = [], plugins = []} = configs;
  return {
    mode: process.env.NET_ENV !== 'production' && process.env.NET_ENV !== 'preview' ? 'development' :'production',
    devtool: process.env.NET_ENV === 'development' ? 'cheap-source-map' : false,
    entry,
    output: {
      path: path.join(__dirname, 'dist/client'),
      filename: process.env.NET_ENV !== 'production' && process.env.NET_ENV !== 'preview' ? '[name].js' :'[name].[contenthash].js',
      chunkFilename: `${projectName}/[name].[chunkhash].js`,
      publicPath: publicRootPath
    },
    resolve: {
      extensions: ['.js', '.json', '.ts', '.tsx', '.vue'],
      alias: {
        'vue': 'vue/dist/vue.js'
      }
    },
    module: {
      rules: [
        ...rules,
        ...commonRules,
      ]
    },
    plugins: [
      ...commonPlugins,
      ...plugins,
      // new AssetsPlugin({metadata: {version: 1.1}, prettyPrint: true}),
    ],
    optimization: process.env.NET_ENV === 'production' ? {
      minimizer: [
        new UglifyJSPlugin({
          uglifyOptions: {
            compress: {
              drop_console: true
            },
            output: {
              comments: false
            }
          }
        })
      ]
    } : undefined
  };
};


let projectCurrents;
if(process.env.NET_ENV === 'production'){
  projectCurrents = config.projectCurrents;
}else{
  projectCurrents = Array.from(new Set(require('./configs')));
}
module.exports = projectCurrents.filter(value=>!!value).map(projectCurrent => buildConfig(projectCurrent));
