import Loadable from 'react-loadable';
import PageLoading from '../../../components/Loading/page';

const Channel = Loadable({
  loader: () => import('./list'),
  loading: PageLoading
});

export default Channel;
