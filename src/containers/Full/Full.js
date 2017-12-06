import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';

import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';
import Dashboard from '../../views/Dashboard/';

class DefaultComponent extends Component {
  render() {
    return null;
  }
}

let Charts = DefaultComponent;
let Widgets = DefaultComponent;

// Components
let Buttons = DefaultComponent;
let Cards = DefaultComponent;
let Forms = DefaultComponent;
let Modals = DefaultComponent;
let SocialButtons = DefaultComponent;
let Switches = DefaultComponent;
let Tables = DefaultComponent;
let Tabs = DefaultComponent;

// Icons
let FontAwesome = DefaultComponent;
let SimpleLineIcons = DefaultComponent;

const isDeveloment = process.env.NODE_ENV === 'development';

console.log(process.env.NODE_ENV);

if (isDeveloment) {
  Charts = require('../../views/Charts/').default;
  Widgets = require('../../views/Widgets/').default;

  // Components
  Buttons = require('../../views/Components/Buttons/').default;
  Cards = require('../../views/Components/Cards/').default;
  Forms = require('../../views/Components/Forms/').default;
  Modals = require('../../views/Components/Modals/').default;
  SocialButtons = require('../../views/Components/SocialButtons/').default;
  Switches = require('../../views/Components/Switches/').default;
  Tables = require('../../views/Components/Tables/').default;
  Tabs = require('../../views/Components/Tabs/').default;

  // Icons
  FontAwesome = require('../../views/Icons/FontAwesome/').default;
  SimpleLineIcons = require('../../views/Icons/SimpleLineIcons/').default;
}

//manage
import { Channel, ChannelRegion } from '../../modules/screens'

class Full extends Component {

  render() {

    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Breadcrumb />
            <Container fluid>
              <Switch>
                <Route path="/dashboard" name="Dashboard" component={Dashboard}/>
                <Route path="/channel" name="Channel" component={Channel}/>
                <Route path="/channel_region" name="Channel" component={ChannelRegion}/>
                <Route path="/components/buttons" name="Buttons" component={Buttons}/>
                <Route path="/components/cards" name="Cards" component={Cards}/>
                <Route path="/components/forms" name="Forms" component={Forms}/>
                <Route path="/components/modals" name="Modals" component={Modals}/>
                <Route path="/components/social-buttons" name="Social Buttons" component={SocialButtons}/>
                <Route path="/components/switches" name="Swithces" component={Switches}/>
                <Route path="/components/tables" name="Tables" component={Tables}/>
                <Route path="/components/tabs" name="Tabs" component={Tabs}/>
                <Route path="/icons/font-awesome" name="Font Awesome" component={FontAwesome}/>
                <Route path="/icons/simple-line-icons" name="Simple Line Icons" component={SimpleLineIcons}/>
                <Route path="/widgets" name="Widgets" component={Widgets}/>
                <Route path="/charts" name="Charts" component={Charts}/>
                <Redirect from="/" to="/channel"/>
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
