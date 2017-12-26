import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, Router, browserHistory, Redirect } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

// Styles
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../assets/scss/style.scss'
// Temp fix for reactstrap
import '../assets/scss/core/_dropdown-menu-right.scss'

import { reducers } from './modules';
import { Login } from './modules/screens'
import { Auth } from './modules/services'
import Full from './containers/Full/Full';

const middleware = [ thunk ]
const enhancers = compose(applyMiddleware(...middleware));
const store = createStore(reducers, enhancers)
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
            return <Login auth={auth} {...props} />
          }} />
          <Route path="/" name="Home" render={(props)=> {
            if (auth.isLogin()) {
              return <Full {...props} />
            } else {
              return <Redirect to="/login" />
            }
          }} />
          <Redirect from="/" to="/channel" />
				</Switch>
			</HashRouter>
    );
  }
}

ReactDOM.render((
  <Provider store={store}>
	  <App/>
  </Provider>
), document.getElementById('root'));
