const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = env => {
  const definePlugin = new webpack.DefinePlugin({
    __PRODUCTION__: JSON.stringify(
      JSON.parse(env ? env.BUILD_PRODUCTION || "false" : "false")
    )
  });

  let webpackConfig = {
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
      publicPath: "/"
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: [path.resolve(__dirname, "src")],
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader"
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: "style-loader"
            },
            {
              loader: "css-loader",
              options: {
                modules: true,
                localsConvention: "camelCase"
              }
            }
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: ["file-loader"]
        }
      ]
    },
    resolve: {
      extensions: [".js"],
      alias: {
        ["~"]: path.resolve(__dirname, "src")
      }
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html"
      }),
      definePlugin
    ]
  };

  return webpackConfig;
};
