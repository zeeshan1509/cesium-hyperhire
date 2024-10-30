const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const assetSources = "./src";
module.exports = [
  {
    mode: "production",
    context: __dirname,
    entry: {
      app: "./src/index.js",
    },
    output: {
      path: path.resolve(__dirname, "Release-v1"),
      filename: "[name].bundle.js",

      // Needed to compile multiline strings in Cesium
      sourcePrefix: "",
    },

    resolve: {
      fallback: {
        url: require.resolve("url"),
        fs: require.resolve("fs"),
        assert: require.resolve("assert"),
        crypto: require.resolve("crypto-browserify"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        buffer: require.resolve("buffer"),
        stream: require.resolve("stream-browserify"),
        zlib: require.resolve("browserify-zlib"),
      },
      mainFields: ["module", "main"],
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        },

        {
          test: /\.css$/,
          use: ["style-loader", { loader: "css-loader" }],
          sideEffects: true,
        },
        {
          test: /\.(png|gif|jpg|jpeg|svg|xml|kmz|kml)$/,
          exclude: /node_modules/,
          use: "url-loader?name=./Assets/Images/[name].[ext]",
        },

        {
          // Remove pragmas
          test: /\.js$/,
          enforce: "pre",
          include: path.resolve(__dirname, "node_modules/cesium/Source"),
          sideEffects: false,
          use: [
            {
              loader: "strip-pragma-loader",
              options: {
                pragmas: {
                  debug: false,
                },
              },
            },
          ],
        },
      ],
    },
    optimization: {
      usedExports: true,
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]cesium/,
            name: "Cesium",
            chunks: "all",
          },
        },
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "public/index.html",
        favicon: "public/favicon.ico",
      }),

      // Copy Cesium Assets, Widgets, and Workers to a static directory
      new CopyWebpackPlugin({
        patterns: [
          { from: "node_modules/cesium/Build/Cesium/Workers", to: "Workers" },
          {
            from: "node_modules/cesium/Build/Cesium/ThirdParty",
            to: "ThirdParty",
          },
          { from: "node_modules/cesium/Build/Cesium/Assets", to: "Assets" },
          { from: "node_modules/cesium/Build/Cesium/Widgets", to: "Widgets" },
          { from: path.join(assetSources, "Assets"), to: "Assets" },
        ],
      }),
      new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify(""),
      }),
    ],
  },
];
