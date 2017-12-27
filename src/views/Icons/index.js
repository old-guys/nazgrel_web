import Loadable from 'react-loadable';
import PageLoading from '../../components/Loading/page';

export const FontAwesome = Loadable({
  loader: () => import('./FontAwesome'),
  loading: PageLoading
});

export const SimpleLineIcons = Loadable({
  loader: () => import('./SimpleLineIcons'),
  loading: PageLoading
});
