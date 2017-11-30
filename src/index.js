import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, Router, browserHistory, Redirect} from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { reducers } from './modules';

// Styles
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../assets/scss/style.scss'
// Temp fix for reactstrap
import '../assets/scss/core/_dropdown-menu-right.scss'

// Containers
import Full from './containers/Full/'

// Views
import { Login } from './modules/screens'
import Register from './views/Pages/Register/'
import Page404 from './views/Pages/Page404/'
import Page500 from './views/Pages/Page500/'

import { Auth } from './modules/services'

const middleware = [ thunk ]
const enhancers = compose(applyMiddleware(...middleware));
const store = createStore(reducers, enhancers)
let auth = new Auth();

// require.ensure([], () => {
//   require('./modules/screens/login')
//   require('./modules/services/auth')
// }, 'chunk2')

class App extends Component{
  constructor(props, context){
    super(props, context);
  }

  render(){
    return (
      <HashRouter>
				<Switch>
				  <Route path="/login" name="Login Page" render={(props)=>{
            return <Login auth={auth} {...props} />
          }} />
				  <Route exact path="/register" name="Register Page" component={Register}/>
				  <Route exact path="/404" name="Page 404" component={Page404}/>
				  <Route exact path="/500" name="Page 500" component={Page500}/>
				  <Route path="/" name="Home" render={(props)=> {
            if (auth.isLogin()) {
              return <Full {...props} />
            } else {
              return <Redirect to="/login" />
            }
          }}/>
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
