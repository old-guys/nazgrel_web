import React, {Component} from 'react';
import {Container, Row, Col, CardGroup, Card, CardBody, Button, Input, InputGroup, InputGroupAddon} from 'reactstrap';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import { fetchAuthLogin } from '../reducers/auth';
import Notificator from './../../components/Notificator/'

@connect(state => ({
  loginUser: state.auth
}), { fetchAuthLogin })
export default class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      phoneNumber: '',
      password: '',
    }
  }

  componentDidMount() {
    this.notificator = this.refs.notificator;
  }

  async handleUserLogin() {
    const { phoneNumber, password } = this.state;

    try {
      const res = await this.props.fetchAuthLogin({ login: phoneNumber, password });
      const { userToken } = this.props.loginUser;

      if (Number(res.code) === 0 && userToken) {
        this.props.auth.login(res.data);
        this.setState({ redirect: true });
      } else {
        this.notificator.error({ text: '账号或密码错误' });
      }
    } catch(e) {
      this.setState({ networkError: true });
    }
  }

  render() {

    if (this.state.redirect) {
      return <Redirect push to="/channel"/>;
    }

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <p className="text-muted">登录你的账号</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon><i className="icon-user"></i></InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="用户名"
                        onChange={ e => {
                          this.setState({ phoneNumber: e.currentTarget.value })
                          }
                        }
                      />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon><i className="icon-lock"></i></InputGroupAddon>
                      <Input
                        type="password"
                        placeholder="密码"
                         onChange={ e => this.setState({ password: e.currentTarget.value })}
                      />
                    </InputGroup>
                    <Row>
                      <Col xs="6">
                        <Button
                          color="primary"
                          className="px-4"
                          onClick={() => this.handleUserLogin()}
                        >登录</Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
        <Notificator ref="notificator" />
      </div>
    );

  }
}
