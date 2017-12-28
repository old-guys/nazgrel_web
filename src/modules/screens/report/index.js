import Loadable from 'react-loadable';
import PageLoading from 'components/Loading/page';

export const ReportChannelShopNewerReport = Loadable({
  loader: () => import('./channel_shop_newers/report'),
  loading: PageLoading
});
