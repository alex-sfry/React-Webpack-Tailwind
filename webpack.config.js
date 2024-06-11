import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let mode = '';

if (process.env.NODE_ENV === 'production') {
    mode = 'production';
}

if (process.env.NODE_ENV === 'development') {
    mode = 'development';
}

console.log(mode + ' mode');

export default {
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/, // Matches all CSS files
                use: [
                    mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader', // Injects styles into DOM
                    'css-loader',   // Translates CSS to CommonJS modules
                    'postcss-loader',
                ],
            },
            {
                test: /\.s[ac]ss$/i, // Matches all SCSS/Sass files with any extension (scss or sass)
                use: [
                    mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader', // Injects styles into DOM
                    'css-loader',   // Translates CSS to CommonJS modules
                    'sass-loader',  // Compiles Sass/SCSS to CSS
                    'postcss-loader',
                ],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './public/index.html' }),
        new MiniCssExtractPlugin({
            filename: '[name].css', // Output filename for extracted CSS
            chunkFilename: '[id].css', // Output filename for CSS chunks
        }),
        new CssMinimizerPlugin(),
        new ESLintPlugin(),
    ],
    devServer: {
        hot: true,
        port: 3000,
        open: true
    }

}