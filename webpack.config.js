const path = require("path");
const fs = require("fs");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = fs.realpathSync(process.cwd());
let resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

function isJSONFile(filePath) {
    const jsonExts = [".json", "rc"];
    for (const jsonExt of jsonExts) {
      if (filePath.endsWith(jsonExt)) return true;
    }
    return false;
  };

function getConfig(configFiles) {
    for (const configFile of configFiles) {
      const configFilePath = path.resolve("./", configFile);
      if (fs.existsSync(configFilePath)) {
        return [
          configFilePath,
          isJSONFile(configFilePath)
            ? JSON.parse(fs.readFileSync(configFilePath))
            : importModule(configFilePath),
        ];
      }
    }
  };

function getSwcConfig() {
    const swcConfig = getConfig([".swcrc"]);
    if (swcConfig) {
      return swcConfig[1];
    }
  };

let loader;

let swcConfig = getSwcConfig();
let isEnvProduction = process.env.PRODUCTION === 'true';
let moduleFileExtensions = ["web.mjs","mjs","web.js","js","web.ts","ts","web.tsx","tsx","json","web.jsx", "jsx"];
let pathHtml = resolveApp('main.html')


if (!isEnvProduction) {
    swcConfig = merge(swcConfig, {
    jsc: {
        transform: {
        react: {
            development: !isEnvProduction,
            refresh: true,
        },
        },
    },
    });
}
loader = ["swc-loader", swcConfig];

exports.default = {
    devServer: {
      hot: true,
      static: { directory: resolveApp('assets') },
      historyApiFallback: true,
      compress: true,
      open: true,
    },
    optimization: {
      splitChunks: isEnvProduction
        ? {
            chunks: "all",
            cacheGroups: {
              default: false,
              defaultVendors: false,
              framework: {
                chunks: "all",
                name: "framework",
                test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
                priority: 40,
                enforce: true,
              },
            },
          }
        : undefined,
      runtimeChunk: 'single',
      minimize: isEnvProduction,
    },
    entry: './src/main.tsx',
    mode: isEnvProduction ? "production" : "development",
    bail: isEnvProduction,
    output: {
      path: resolveApp('dist'),
      publicPath: "/",
      pathinfo: !isEnvProduction,
      filename: "assets/[contenthash].js",
      chunkFilename: "assets/[contenthash].chunk.js",
      assetModuleFilename: "assets/[hash][ext][query]",
    },
    resolve: {
      modules: [path.resolve("node_modules"), "node_modules"],
      extensions: moduleFileExtensions.map((ext) => `.${ext}`),
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          include: [resolveApp('')],
          exclude: /node_modules/,
          loader: loader[0],
          options: loader[1],
        },
        {
            test: /\.css$/i,
            include: path.resolve(__dirname, 'src'),
            use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
      ],
    },
    plugins: [
      isEnvProduction &&
        fs.readdirSync(resolveApp('assets')).length > 1 &&
        new CopyPlugin({
          patterns: [
            {
              from: resolveApp('assets'),
              to: resolveApp('dist'),
              filter: (resourcePath) => resourcePath !== pathHtml,
            },
          ],
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: pathHtml,
            ...(isEnvProduction && {
              minify: "auto",
            }),
            templateParameters: (compilation, assets, tags, options) => {
              tags.headTags.forEach((tag) => {
                  if (tag.tagName === 'script') {
                      tag.attributes.async = true;
                  }
              });
              return {
                   htmlWebpackPlugin: { options }
              }
           },
          }),
      !isEnvProduction && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
};