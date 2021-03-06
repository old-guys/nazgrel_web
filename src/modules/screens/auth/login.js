import React, {Component} from 'react';
import { Container, Row, Col, Card, CardTitle, CardBody, Button, FormGroup, InputGroup, InputGroupAddon, InputGroupText} from 'reactstrap';
import { AvForm, AvGroup, AvField, AvInput, AvFeedback } from 'availity-reactstrap-validation';

import { connect } from 'react-redux';
// import { Redirect } from 'react-router-dom'
import { fetchAuthLogin } from 'reducers/auth';
import Notificator from 'components/Notificator/'

@connect(state => ({
  loginUser: state.auth
}), { fetchAuthLogin })
export default class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      login: '',
      password: '',
      redirect: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.notificator = this.refs.notificator;
  }

  handleSubmit(event, errors, values) {
    if (_.isEmpty(errors)) this.userLogin();
  }

  async userLogin() {
    try {
      const location = this.props.auth.getStoreLocation();
      const { login, password } = this.state;
      const res = await this.props.fetchAuthLogin({ login, password });
      const { userToken } = this.props.loginUser;

      if (Number(res.code) === 0 && userToken) {
        this.props.auth.login(res.data);
        this.props.history.push(location || '/channel');
        // this.setState({ redirect: true });
      } else {
        this.notificator.error({ text: '账号或密码错误' });
      }
    } catch(e) {
      this.setState({ networkError: true });
    }
  }

  render() {

    // if (this.state.redirect) {
    //   return <Redirect push to="/"/>;
    // }

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col xs={6} md={8}>
              <Card className="p-4">
                <CardTitle>登录你的账号</CardTitle>
                <CardBody >
                  <AvForm onSubmit={this.handleSubmit} >
                    <AvGroup row>
                      <Col xs={8} md={10}>
                        <InputGroup bssize="lg" className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <AvInput
                            name="login"
                            type="text"
                            placeholder="输入账号"
                            className="form-control"
                            bssize="lg"
                            block="true"
                            required
                            onChange={(e) => {
                              this.setState({ login: e.currentTarget.value });
                            }}
                            errorMessage={{required: '输入账号'}}
                          />
                          <AvFeedback>输入账号</AvFeedback>
                        </InputGroup>
                      </Col>
                    </AvGroup>
                    <AvGroup row>
                      <Col xs={8} md={10}>
                        <InputGroup bssize="lg" className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <AvInput
                            name="password"
                            type="password"
                            placeholder="输入密码"
                            className="form-control"
                            bssize="lg"
                            block="true"
                            required
                            onChange={(e) => {
                              this.setState({ password: e.currentTarget.value });
                            }}
                            errorMessage={{required: '输入密码'}}
                          />
                          <AvFeedback>输入密码</AvFeedback>
                        </InputGroup>
                      </Col>
                    </AvGroup>
                    <FormGroup>
                      <Col lg={{ size: 'auto'}}>
                        <Button type="submit" color="primary" size="lg" >
                          登录
                        </Button>
                      </Col>
                    </FormGroup>
                  </AvForm>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <Notificator ref="notificator" />
      </div>
    );

  }
}
