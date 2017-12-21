let defaultRoutes = {
  '/': '首页',
  '/channel': '渠道设置',
  '/channel_region': '渠道管理员',
  '/newly_shop': '新增店主'
};

let envRotues = {
  development: {
    '/dashboard': 'Dashboard',
    '/components': 'Components',
    '/charts': 'Charts',
    '/components/buttons': 'Buttons',
    '/components/social-buttons': 'Social Buttons',
    '/components/cards': 'Cards',
    '/components/forms': 'Forms',
    '/components/modals': 'Modals',
    '/components/switches': 'Switches',
    '/components/tables': 'Tables',
    '/components/tabs': 'Tabs',
    '/icons': 'Icons',
    '/icons/font-awesome': 'Font Awesome',
    '/icons/simple-line-icons': 'Simple Line Icons',
    '/widgets': 'Widgets',
    '/demo/list': 'List',
  }
}[process.env.NODE_ENV];

let routes = _.assign(defaultRoutes, envRotues);

export default routes;
