const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  mode: 'production', // Установите режим на 'production' для минификации
  entry: './src/scripts/index.js', // Укажите точку входа вашего приложения
  output: {
    filename: 'bundle.js', // Имя выходного файла
    path: path.resolve(__dirname, 'dist'), // Папка для выходных файлов
    clean: true, // Очищает папку dist при каждой сборке
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Применяем Babel к файлам .js
        exclude: /node_modules/, // Исключаем папку node_modules
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/, // Применяем обработку к файлам .css
        use: [
          MiniCssExtractPlugin.loader, // Извлечение CSS в отдельный файл
            'css-loader', // Обработка CSS
          'postcss-loader',
        ],
          },
      
       {
        test: /\.(png|jpg|gif|svg)$/, // Обработка изображений
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 8192, // Если файл меньше 8kb, он будет встроен как base64
              name: '[name].[ext]', // Имя выходного файла
              outputPath: 'images/', // Папка для выходных изображений
            },
          },
        ],
          },
       
        {
        test: /\.(woff|woff2|eot|ttf|otf)$/, // Обработка шрифтов
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]', // Имя выходного файла
              outputPath: 'fonts/', // Папка для выходных шрифтов
            },
          },
        ],
      },
    ],
    },
  
    optimization: {
        minimize: true, // Включаем минификацию
        minimizer: [
        `...`, // Сохраняем стандартные минификаторы
        new CssMinimizerPlugin(), // Добавляем минификатор CSS
        ],
    },
    
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Шаблон вашего HTML-файла
      filename: 'index.html', // Имя выходного HTML-файла
    }),
    new MiniCssExtractPlugin({
      filename: 'index.css', // Имя выходного CSS-файла
    }),
  ],
};