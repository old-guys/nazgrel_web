import {
  Alerts,
  Badges,
  Breadcrumbs,
  ButtonDropdowns,
  ButtonGroups,
  Buttons,
  Cards,
  Carousels,
  Charts,
  Collapses,
  Colors,
  Dashboard,
  Dropdowns,
  Flags,
  FontAwesome,
  Forms,
  Jumbotrons,
  ListGroups,
  Modals,
  Navbars,
  Navs,
  Paginations,
  Popovers,
  ProgressBar,
  SimpleLineIcons,
  BrandButtons,
  Switches,
  Tables,
  Tabs,
  Tooltips,
  Typography,
  Widgets,
} from './views';

import Full from 'containers/Full/Full';
import {
  Channel, ChannelRegion,
  ReportChannelShopNewerReport, ReportChannelShopActivityReport, ReportShopEcn
} from 'screens';
import { Auth } from 'services';

let defaultRoutes = [
  // { path: '/', exact: true, name: '首页', component: Full },
  { path: '/login', exact: true, name: '登陆', component: Auth },
  { path: '/channel', exact: true, name: '渠道设置', component: Channel },
  { path: '/channel_region', exact: true, name: '渠道管理员', component: ChannelRegion },
  { path: '/report/channel_shop_newer/report', exact: true, name: '新增店主', component: ReportChannelShopNewerReport },
  { path: '/report/channel_shop_activities/report', name: '渠道店主行为', component: ReportChannelShopActivityReport },
  { path: '/report/shop_ecns', exact: true, name: '店主ECN', component: ReportShopEcn },
];

let envRotues = {
  development: [
    // { path: '/', exact: true, name: 'Home', component: Full },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard },
    { path: '/theme', exact: true, name: 'Theme', component: Colors },
    { path: '/theme/colors', name: 'Colors', component: Colors },
    { path: '/theme/typography', name: 'Typography', component: Typography },
    { path: '/base', exact: true, name: 'Base', component: Cards },
    { path: '/base/cards', name: 'Cards', component: Cards },
    { path: '/base/forms', name: 'Forms', component: Forms },
    { path: '/base/switches', name: 'Swithces', component: Switches },
    { path: '/base/tables', name: 'Tables', component: Tables },
    { path: '/base/tabs', name: 'Tabs', component: Tabs },
    { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
    { path: '/base/carousels', name: 'Carousels', component: Carousels },
    { path: '/base/collapses', name: 'Collapses', component: Collapses },
    { path: '/base/dropdowns', name: 'Dropdowns', component: Dropdowns },
    { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
    { path: '/base/list-groups', name: 'ListGroups', component: ListGroups },
    { path: '/base/navbars', name: 'Navbars', component: Navbars },
    { path: '/base/navs', name: 'Navs', component: Navs },
    { path: '/base/paginations', name: 'Paginations', component: Paginations },
    { path: '/base/popovers', name: 'Popovers', component: Popovers },
    { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
    { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
    { path: '/buttons', exact: true, name: 'Buttons', component: Buttons },
    { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
    { path: '/buttons/button-dropdowns', name: 'ButtonDropdowns', component: ButtonDropdowns },
    { path: '/buttons/button-groups', name: 'ButtonGroups', component: ButtonGroups },
    { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
    { path: '/icons', exact: true, name: 'Icons', component: Flags },
    { path: '/icons/flags', name: 'Flags', component: Flags },
    { path: '/icons/font-awesome', name: 'Font Awesome', component: FontAwesome },
    { path: '/icons/simple-line-icons', name: 'Simple Line Icons', component: SimpleLineIcons },
    { path: '/notifications', exact: true, name: 'Notifications', component: Alerts },
    { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
    { path: '/notifications/badges', name: 'Badges', component: Badges },
    { path: '/notifications/modals', name: 'Modals', component: Modals },
    { path: '/widgets', name: 'Widgets', component: Widgets },
    { path: '/charts', name: 'Charts', component: Charts },
  ]
}[process.env.NODE_ENV];

let routes = envRotues ? _.concat(defaultRoutes, envRotues) : defaultRoutes;

export default routes;
