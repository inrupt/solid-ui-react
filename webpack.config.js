const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  devtool: "source-map",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ],
  },
  optimization: {
    minimize: false,
  },
  output: {
    filename: "index.js",
    libraryTarget: "umd",
    globalObject: "this",
    path: path.resolve("./dist/")
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  externals: [
    "@inrupt/solid-client",
    "@inrupt/solid-client-authn-browser",
    "@inrupt/solid-client-authn-node",
    "@material-ui/core",
    "core-js",
    "react",
    "react-table",
    "swr",
  ]
};
