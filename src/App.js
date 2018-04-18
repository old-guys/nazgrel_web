import React, {Component} from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import './App.css';


// Styles
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import './scss/style.css'
// import '../node_modules/@coreui/styles/scss/_dropdown-menu-right.scss';

import reducers from 'reducers';
import { Login } from 'screens';
import { Auth, logger } from 'services';
// Containers
import Full from 'containers/Full/Full';

// import { renderRoutes } from 'react-router-config';

let auth = new Auth();

class App extends Component{
  constructor(props, context){
    super(props, context);
  }
  componentDidMount() {
    window.loading_screen.finish();
  }

  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path="/login" name="Login" render={(props)=>{
            return <Login auth={auth} {...props} />;
          }} />
          <Route path="/" name="Home" render={(props)=> {
            if (auth.isLogin()) {
              return <Full {...props} />;
            } else {
              auth.setStoreLocation(props.location);
              return <Redirect to="/login" />;
            }
          }} />
          <Redirect from="/" to="/channel" />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
