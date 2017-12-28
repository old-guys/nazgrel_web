import Loadable from 'react-loadable';
import PageLoading from 'components/Loading/page'

const Login = Loadable({
  loader: () => import('./login'),
  loading: PageLoading
});

export default Login;
