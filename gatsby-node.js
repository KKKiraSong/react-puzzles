const path = require('path');

exports.onCreateWebpackConfig = args => {
  args.actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, '../src'), 'node_modules'],
      alias: {
        'react-blocks/lib': path.resolve(__dirname, '../components/'),
        'react-blocks/esm': path.resolve(__dirname, '../components/'),
        'react-blocks': path.resolve(__dirname, '../components/'),
      },
    },
  });
};
