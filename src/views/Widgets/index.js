import Loadable from 'react-loadable';
import PageLoading from '../../components/Loading/page';

const Widgets = Loadable({
  loader: () => import('./Widgets'),
  loading: PageLoading
});

export default Widgets;
