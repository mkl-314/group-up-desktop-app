const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html",
});

const config = {
  target: "electron-renderer",
  devtool: "source-map",
  entry: "./src/app/renderer.tsx",
  output: {
    filename: "renderer.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|jp2|webp)$/,
        loader: "file-loader",
        options: {
          name: "images/[name].[ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".scss", ".css", ".jpg", ".svg"],
  },
  plugins: [htmlPlugin],
};

module.exports = (env, argv) => {
  return config;
};
