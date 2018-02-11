import _ from 'lodash';
import React, {Component} from 'react';

import { Container, Row, Col, Card, CardTitle, CardBody, Button} from 'reactstrap';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidMount() {
    window.loading_screen.finish();
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    Raven.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      return (
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col xs={6} md={8}>
                <Card className="p-4 text-center">
                  <CardTitle>抱歉，程序出错了😞.</CardTitle>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}
