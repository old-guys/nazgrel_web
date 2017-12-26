import Loadable from 'react-loadable';
import PageLoading from '../../components/Loading/page';

export const Buttons = Loadable({
  loader: () => import('./Buttons'),
  loading: PageLoading
});

export const Cards = Loadable({
  loader: () => import('./Cards'),
  loading: PageLoading
});

export const Forms = Loadable({
  loader: () => import('./Forms'),
  loading: PageLoading
});

export const Modals = Loadable({
  loader: () => import('./Modals'),
  loading: PageLoading
});

export const SocialButtons = Loadable({
  loader: () => import('./SocialButtons'),
  loading: PageLoading
});

export const Switches = Loadable({
  loader: () => import('./Switches'),
  loading: PageLoading
});

export const Tables = Loadable({
  loader: () => import('./Tables'),
  loading: PageLoading
});

export const Tabs = Loadable({
  loader: () => import('./Tabs'),
  loading: PageLoading
});
