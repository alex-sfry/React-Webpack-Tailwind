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
            filename: 'bundle-[fullhash].js',
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
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/i,
                    type: 'asset',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 4 * 1024, // 4kb
                        },
                    },
                    generator: {
                        filename: 'images/[fullhash][ext]',
                    },
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name][ext]',
                    },
                },
                {
                    test: /\.json$/,
                    type: 'json',
                    generator: {
                        filename: 'json/[name][ext]',
                    },
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({ template: './public/index.html' }),
            new MiniCssExtractPlugin({
                filename: 'css/[name]-[fullhash].css', // Output filename for extracted CSS
                chunkFilename: 'css/[id].css', // Output filename for CSS chunks
            }),
            new CssMinimizerPlugin(),
            new Dotenv(),
            new ESLintPlugin({
                threads: true,
                failOnWarning: false
            }),
        ],
        devServer: {
            compress: true,
            hot: true,
            port: 3000,
            open: true,
            client: {
                logging: 'none',
                overlay: false,
            }
        },
        optimization: {
            usedExports: true,
            minimize: optimize,
            minimizer: [new TerserPlugin()],
        },
    }
}