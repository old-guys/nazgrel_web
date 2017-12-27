import React, {Component} from 'react';
import Loadable from 'react-loadable';
import PageLoading from '../../../components/Loading/page';

export const Demo = Loadable({
  loader: () => import('./list'),
  loading: PageLoading
});

export const NewDemo = Loadable({
  loader: () => import('./new'),
  loading: PageLoading,
  render(loaded, props) {
    let Component = loaded.default;
    return <Component ref='NewDemo' {...props} />;
  }
});

export const EditDemo = Loadable({
  loader: () => import('./edit'),
  loading: PageLoading,
  render(loaded, props) {
    let Component = loaded.default;
    return <Component ref='EditDemo' {...props} />;
  }
});

export const DestroyDemo = Loadable({
  loader: () => import('./destroy'),
  loading: PageLoading,
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  }
});
