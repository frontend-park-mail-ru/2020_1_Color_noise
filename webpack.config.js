const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');


module.exports = {
  mode: 'development',
  entry: {
    bundle: path.join(__dirname, '/src/index.js'),
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].js',//.[contenthash]
  },
  devServer: {
    before: (app, server) => {
      // Support for cases when page loaded on other pathname than /.
      // Without it we got 404 when trying to open paths like /topics.
      app.get("*", (req, res, next) => {
        console.log(req, res);
        if ( ! (req.url.endsWith(".svg")
            || req.url.endsWith(".js")
            || req.url.endsWith(".ico")
            || req.url.endsWith(".js.map")) ) {
          req.url = "/"
        }
        //if (req.url.endsWith(".js"))
        //  req.url = "/main.js"


        next("route");
      });
    }
  },

  module: {
    rules: [
      {
        test: /\.(css)$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.pug$/,
        use: [
          'pug-loader'
        ]
      },
      // static
      {
        test: /\.(png|ico|svg|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name(resourcePath, resourceQuery) {
              return '/images/' + '[name].[ext]';
            //[contenthash].[ext]
          },
        },
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/src/views/index.html'),
      filename: 'index.html'
    }),



    new WorkboxPlugin.InjectManifest({


      swSrc: "./src/utils/serviceWorkerMy.js",
      swDest: "service-worker.js",

      //directoryIndex: 'index.html',
      //clientsClaim: true, // true - захват управления клиентом без перезагрузки

      include: [/\.jpg$/, /\.png$/, /\.jpeg$/, /\.svg$/,  /\.html$/,  /\.js$/,  /\.css$/],


      /* тут настройка для старого воркера


      // Define runtime caching rules.
      // runtimeCaching - правила действующие во время  выполнения приложения
      runtimeCaching: [{
        // Match any request that ends with .png, .jpg, .jpeg or .svg.
        urlPattern: /(?:chats|notifications|profile|newPin|main|pin\/[*]|\.(?:png|jpg|jpeg|svg|html|js|css|))|$/,
        // Apply a cache-first strategy.
       handler: 'CacheFirst',


        navigateFallback : "/",

        options: {
          // Use a custom cache name.
          cacheName: 'images',
          expiration: {
            maxEntries: 50, // лимит кешированных записей, если достигнут лимит
            // время жизни кеша, после которого кеш нужно обновлять
            maxAgeSeconds: 86400,
          },

          cacheableResponse: {
            statuses: [0, 200, 300, 301, 304],  // допустимые коды статусы ответа сервера
          },
        },
      }],
      */




    })




  ]
};