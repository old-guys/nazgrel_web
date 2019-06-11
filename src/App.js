import React, { Component } from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
// const Login = React.lazy(() => import('./views/Pages/Login'));
// const Register = React.lazy(() => import('./views/Pages/Register'));
// const Page404 = React.lazy(() => import('./views/Pages/Page404'));
// const Page500 = React.lazy(() => import('./views/Pages/Page500'));

import { Login } from 'screens';
import { Auth } from 'services';

let auth = new Auth();

class App extends Component {
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    window.loading_screen.finish();
  }

  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route path="/login" name="Login" render={(props) => {
              return <Login auth={auth} {...props} />;
            }} />
            <Route path="/" name="Home" render={(props) => {
              if (auth.isLogin()) {
                return <DefaultLayout {...props} />;
              } else {
                auth.setStoreLocation(props.location);
                return <Redirect to="/login" />;
              }
            }} />
            <Redirect from="/" to="/channel" />
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}

export default App;
