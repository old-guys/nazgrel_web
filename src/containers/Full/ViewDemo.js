import React, {Component} from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Charts from '../../views/Charts/';
import Widgets from '../../views/Widgets/';

// Components
import Buttons from '../../views/Components/Buttons/';
import Cards from '../../views/Components/Cards/';
import Forms from '../../views/Components/Forms/';
import Modals from '../../views/Components/Modals/';
import SocialButtons from '../../views/Components/SocialButtons/';
import Switches from '../../views/Components/Switches/';
import Tables from '../../views/Components/Tables/';
import Tabs from '../../views/Components/Tabs/';

// Icons
import FontAwesome from '../../views/Icons/FontAwesome/';
import SimpleLineIcons from '../../views/Icons/SimpleLineIcons/';

import Register from '../../views/Pages/Register/'
import Page404 from '../../views/Pages/Page404/'
import Page500 from '../../views/Pages/Page500/'

export class ViewDemo1 extends Component {
  render() {
    return (
      <div>
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
      </div>
    );
  }
}

export class ViewDemo2 extends Component {
  render() {
    return (
      <div>
        <Route exact path="/register" name="Register Page" component={Register}/>
        <Route exact path="/404" name="Page 404" component={Page404}/>
        <Route exact path="/500" name="Page 500" component={Page500}/>
      </div>
    );
  }
}
