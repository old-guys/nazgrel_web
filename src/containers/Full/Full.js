import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Container } from 'reactstrap';

import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';
import Dashboard from '../../views/Dashboard/';
import { Channel, ChannelRegion } from '../../modules/screens'

let ViewDemo1 = null;
if (process.env.NODE_ENV === 'development') {
  ViewDemo1 = require('./ViewDemo').ViewDemo1;
}

class Full extends Component {

  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props} />
          <main className="main">
            <Breadcrumb />
            <Container fluid>
              <Switch>
                <Route path="/dashboard" name="Dashboard" component={Dashboard}/>
                <Route path="/channel" name="Channel" component={Channel}/>
                <Route path="/channel_region" name="Channel" component={ChannelRegion}/>
                { ViewDemo1 ? <ViewDemo1 /> : '' }
                <Redirect from="/" to="/channel" />
              </Switch>
            </Container>
          </main>
          <Aside />
        </div>
        <Footer />
      </div>
    );
  }
}

export default Full;
