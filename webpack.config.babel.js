import Config, { environment } from 'webpack-config';

const ENV = (process.env.WEBPACK_ENV || 'dev').replace('_', '.');

environment.setAll({
  platform: ENV,
  env: () => {
    if (ENV === 'dev') {
      return 'dev';
    } else if (ENV === 'local') {
      return 'dev';
    } else if (ENV.indexOf('test') > -1) {
      return 'test';
    }

    return 'prod';
  },
});

export default new Config().extend('./webpack/webpack.[env].config.js');
