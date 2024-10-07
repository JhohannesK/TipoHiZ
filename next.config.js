// next.config.js
const nextConfig = {
   webpack: (config) => {
      config.module.rules.push({
         test: /\.(mp3|wav|ogg)$/,
         use: {
            loader: 'file-loader',
            options: {
               name: '[name].[hash].[ext]',
               outputPath: 'sounds/',
            },
         },
      });
      return config;
   },
};

module.exports = nextConfig;
