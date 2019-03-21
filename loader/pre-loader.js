require('typescript-require');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const loaderUtils = require('loader-utils');

module.exports = function (source) {

  if (this.cacheable) {
    this.cacheable();
  }

  // Skip .js files
  if (/\.js$/.test(this.request)) {
    return source;
  }

  // The following part renders the tempalte with lodash as aminimalistic loader
  //
  // Get templating options
  let options = loaderUtils.parseQuery(this.query) || {};
  let resourcePath = options.resource;
  let preLoaderData;
  try {
    if (fs.existsSync(resourcePath)) {
      //删除 Require Cache，保证每次资源文件更新后，可以及时获取最新内容
      delete require.cache[resourcePath];
      preLoaderData = require(resourcePath);
      preLoaderData = preLoaderData.default || preLoaderData;
    }
  } catch (e) {
    throw new Error(`preLoaderData parse fail, ${e.message}`);
  }

  options.client = true;

  options.filename = path.relative(process.cwd(), this.resourcePath);

  // Webpack 2 does not allow with() statements, which lodash templates use to unwrap
  // the parameters passed to the compiled template inside the scope. We therefore
  // need to unwrap them ourselves here. This is essentially what lodash does internally
  // To tell lodash it should not use with we set a letiable
  // All templateletiables which should be available
  // @see HtmlWebpackPlugin.prototype.executeTemplate

  return ejs.render(source, preLoaderData, {filename: path.relative(process.cwd(), this.resourcePath)});
};
