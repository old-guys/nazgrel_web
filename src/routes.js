let defaultRoutes = {
  '/': '首页',
  '/channel': '渠道设置',
  '/channel_region': '渠道管理员',
  '/report/channel_shop_newer/report': '新增店主',
  '/report/channel_shop_activities/report': '渠道店主行为',
  '/report/shop_ecns': '店主ECN'
};

let envRotues = {
  development: {
    '/': 'Home',
    '/base': 'Base',
    '/base/cards': 'Cards',
    '/base/forms': 'Forms',
    '/base/switches': 'Switches',
    '/base/tables': 'Tables',
    '/base/tabs': 'Tabs',
    '/base/breadcrumbs': 'Breadcrumbs',
    '/base/carousels': 'Carousels',
    '/base/collapses': 'Collapses',
    '/base/jumbotrons': 'Jumbotrons',
    '/base/list-groups': 'List Groups',
    '/base/navbars': 'Navbars',
    '/base/navs': 'Navs',
    '/base/paginations': 'Paginations',
    '/base/popovers': 'Popovers',
    '/base/progress-bar': 'Progress Bar',
    '/base/tooltips': 'Tooltips',
    '/buttons': 'Buttons',
    '/buttons/buttons': 'Buttons',
    '/buttons/social-buttons': 'Social Buttons',
    '/buttons/button-dropdowns': 'Button Dropdowns',
    '/buttons/button-groups': 'Button Groups',
    '/charts': 'Charts',
    '/dashboard': 'Dashboard',
    '/icons': 'Icons',
    '/icons/flags': 'Flags',
    '/icons/font-awesome': 'Font Awesome',
    '/icons/simple-line-icons': 'Simple Line Icons',
    '/notifications': 'Notifications',
    '/notifications/alerts': 'Alerts',
    '/notifications/badges': 'Badges',
    '/notifications/modals': 'Modals',
    '/theme': 'Theme',
    '/theme/colors': 'Colors',
    '/theme/typography': 'Typography',
    '/widgets': 'Widgets',
    '/demo/list': 'List',
  }
}[process.env.NODE_ENV];

let routes = _.assign(defaultRoutes, envRotues);

export default routes;
