import Loadable from 'react-loadable';
import PageLoading from '../../components/Loading/page';

const Charts = Loadable({
  loader: () => import('./Charts'),
  loading: PageLoading
});

export default Charts;
