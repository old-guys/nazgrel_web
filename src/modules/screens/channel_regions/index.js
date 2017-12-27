import Loadable from 'react-loadable';
import PageLoading from '../../../components/Loading/page';

const ChannelRegion = Loadable({
  loader: () => import('./list'),
  loading: PageLoading
});

export default ChannelRegion;
