const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
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
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    library: "",
    libraryTarget: "commonjs"
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  externals: [
    "@inrupt/solid-client",
    "@inrupt/solid-client-authn-browser",
    "@material-ui/core",
    "react",
    "react-table",
    "swr",
  ],
};
