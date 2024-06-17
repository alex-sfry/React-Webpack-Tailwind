import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import Dotenv from 'dotenv-webpack';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let mode = '';

if (process.env.NODE_ENV === 'production') {
    mode = 'production';
}

if (process.env.NODE_ENV === 'development') {
    mode = 'development';
}

const optimize = mode === 'production' ? true : false;
console.log(mode + ' mode');

export default (env) => {
    console.log(env)

    return {
        entry: path.join(__dirname, 'src/index.js'),
        output: {
            path: path.join(__dirname, 'build'),
            filename: 'bundle-[hash].js',
            clean: optimize
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
                        mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    auto: true,
                                    namedExport: false,
                                }
                            }
                        },
                        'postcss-loader',
                        
                    ],
                    include: /\.module\.css$/,
                },
                {
                    test: /\.css$/, // Matches all CSS files
                    use: [
                        mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader',
                        'postcss-loader',
                    ],
                    exclude: /\.module\.css$/,
                },
                {
                    test: /\.s[ac]ss$/i, // Matches all SCSS/Sass files with any extension (scss or sass)
                    use: [
                        mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader',
                        'sass-loader',  // Compiles Sass/SCSS to CSS
                        'postcss-loader',
                    ],
                },
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({ template: './public/index.html' }),
            new MiniCssExtractPlugin({
                filename: 'css/[name]-[hash].css', // Output filename for extracted CSS
                chunkFilename: 'css/[id].css', // Output filename for CSS chunks
            }),
            new CssMinimizerPlugin(),
            new Dotenv(),
            new ESLintPlugin({
                threads: true,
                // quiet: true,
                failOnWarning: false
            }),
        ],
        devServer: {
            hot: true,
            port: 3000,
            open: true,
            client: {
                logging: 'none',
                overlay: false,
            }
        },
        optimization: {
            minimize: optimize,
            minimizer: [new TerserPlugin()],
        },
    }
}