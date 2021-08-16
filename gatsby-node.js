const path = require('path');

exports.onCreateWebpackConfig = args => {
  args.actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, '../src'), 'node_modules'],
      alias: {
        'react-puzzles/lib': path.resolve(__dirname, '../components/'),
        'react-puzzles/esm': path.resolve(__dirname, '../components/'),
        'react-puzzles': path.resolve(__dirname, '../components/'),
      },
    },
  });
};
