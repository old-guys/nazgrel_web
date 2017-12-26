import Loadable from 'react-loadable';
import PageLoading from '../../components/Loading/page';

const Dashboard = Loadable({
  loader: () => import('./Dashboard'),
  loading: PageLoading
});

export default Dashboard;
