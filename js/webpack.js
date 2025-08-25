import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';

export const config = {
  entry: style.css,
  output: {
    path: '../css/style.css'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
              root: '../service',
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              outputStyle: 'compressed',
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g|eot|wof|woff|woff2|ttf|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]?[hash]',    // CSSのurl()で読み込まれる画像やフォント類にコンテンツのハッシュ値を付与する
              context: '../service',
              publicPath: '/',
              emitFile: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // manifest.json ファイルを出力する
    new ManifestPlugin({
      basePath: '/css/',
      publicPath: '/css/',
      filter: fileDesc => fileDesc.isInitial,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css?[contenthash]', // 出力されるCSSのファイル名にコンテンツのハッシュ値を付与する
    }),
  ],
};
