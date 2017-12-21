import React, { Component } from 'react'
import { DatePicker } from 'antd';
import { Button, Table, Card, CardBody, Input, Row, Col } from 'reactstrap';

const { MonthPicker } = DatePicker;


class NewlyShop extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  onChange () {

  }

  render() {
    return (
      <div className='newly-shop'>
        <Card>
          <CardBody>
            <h5>筛选</h5>
            <Row className='sort'>
              <Col className='pr0-center' xs="auto">时间范围:</Col>
              <Col className='pr0-center' xs="auto">
                天:
              </Col>
              <Col className='pr0-center' xs="auto">
                <MonthPicker onChange={() => this.onChange()} placeholder="选择月份" />
              </Col>
              <Col className='pr0-center' xs="auto">
                月:
              </Col>
              <Col className='ppr0-center' xs="auto">
                <DatePicker onChange={() => this.onChange()} placeholder="选择日期" />
              </Col>
              <Col className='pr0-center' xs="auto">（默认显示天）</Col>
            </Row>
            
            <Row className='sort'>
              <Col className='pr0-center' xs="auto">所属渠道:</Col>
              <Col xs="1">
                <Input type="select" name="select">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </Input>
              </Col>
            </Row>
            <Table bordered>
              <thead>
                <tr align="center">
                  <th headers="idrefs">合计</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th className='shop_type'>
                    <span>2</span>
                    <span>1</span>
                  </th>
                  <th className='shop_type'>
                    <span>2</span>
                    <span>1</span>
                  </th>
                  <th className='shop_type'>
                    <span>2</span>
                    <span>1</span>
                  </th>
                  <th className='shop_type'>
                    <span>2</span>
                    <span>1</span>
                  </th>
                  <th className='shop_type'>
                    <span>2</span>
                    <span>1</span>
                  </th>
                </tr>
                <tr align="center">
                  <th headers="idrefs">序号</th>
                  <th>责任人</th>
                  <th>所属渠道</th>
                  <th>所在城市</th>
                  <th>00：00至09：00</th>
                  <th>09：00至18：00</th>
                  <th>18：00至24：00</th>
                  <th>本月累计</th>
                  <th>本年累计</th>
                </tr>
                <tr align="center">
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th className='shop_type'>
                    <span>白</span>
                    <span>黄</span>
                  </th>
                  <th className='shop_type'>
                    <span>白</span>
                    <span>黄</span>
                  </th>
                  <th className='shop_type'>
                    <span>白</span>
                    <span>黄</span>
                  </th>
                  <th className='shop_type'>
                    <span>白</span>
                    <span>黄</span>
                  </th>
                  <th className='shop_type'>
                    <span>白</span>
                    <span>黄</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr align="center">
                  <th>1</th>
                  <th>海军</th>
                  <th>奥维斯</th>
                  <th>上海</th>
                  <th className='shop_type'>
                    <span>2</span>
                    <span>1</span>
                  </th>
                  <th className='shop_type'>
                    <span>2</span>
                    <span>1</span>
                  </th>
                  <th className='shop_type'>
                    <span>2</span>
                    <span>1</span>
                  </th>
                  <th className='shop_type'>
                    <span>2</span>
                    <span>1</span>
                  </th>
                  <th className='shop_type'>
                    <span>2</span>
                    <span>1</span>
                  </th>
                </tr>
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default NewlyShop;