console.log('::::', process.env);

const defineConfig = {
  hash: false,
  antd: {},
  layout: false,
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true
  },
  dynamicImport: false,
  targets: {
    ie: 11
  },
  theme: {
    // ...darkTheme,
    'primary-color': '#1B1B23'
  }
  // ignoreMomentLocale: true,
  // proxy: proxy[REACT_APP_ENV || 'dev']
};

export default defineConfig;
