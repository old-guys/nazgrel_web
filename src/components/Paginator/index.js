import React from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Input, Button, Pagination, PaginationItem, PaginationLink } from 'reactstrap';

export default class Paginator extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      linkNum: 5,
      left: 2,
      right: 2,
      go_to_page: props.collection.current_page || 1,
      per_page: props.collection.per_page
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleChangeGoToPage = this.handleChangeGoToPage.bind(this);
    this.handleClickGoToPage = this.handleClickGoToPage.bind(this);
    this.handleChangePerPage = this.handleChangePerPage.bind(this);
    this.handleOnKeyPress = this.handleOnKeyPress.bind(this);
  }

  handlePageChange(event) {
    const value = event.currentTarget.getAttribute('data-page');
    const page = Number(value);

    this.props.handlePageChange({ page });
    this.setState({
      current_page: page,
      go_to_page: page
    });
  }

  handleChangeGoToPage(event) {
    const value = event.target.value;

    if (_.isEmpty(value) || /^\d*$/.test(value)) {
      this.setState({ go_to_page: value });
    }
  }

  handleClickGoToPage(event) {
    const { go_to_page } = this.state;
    const { total_pages } = this.props.collection;
    const page = Number(go_to_page) > total_pages ? total_pages : go_to_page;

    this.props.handlePageChange({ page });
    this.setState({ current_page: page, go_to_page: page });
  }

  handleChangePerPage(event) {
    const value = event.target.value;

    event.target.blur();
    this.props.handlePageChange({ page: 1, per_page: value });
    this.setState({
      current_page: 1,
      go_to_page: 1
    });
  }

  handleOnKeyPress(event) {
    const isEnter = event.charCode === 13;
    if (!isEnter) return;

    event.target.blur();
    this.handleClickGoToPage();
  }

  renderFirst() {
    const { current_page } = this.props.collection;
    const isFirst = current_page === 1;

    return (
      <PaginationItem disabled={ isFirst }>
        <PaginationLink href="javascript:;" data-page="1" onClick={ this.handlePageChange }>
          <i className="fa fa-angle-double-left"></i>
        </PaginationLink>
      </PaginationItem>
    );
  }

  renderPrev() {
    const { current_page } = this.props.collection;
    const isFirst = current_page === 1;

    return (
      <PaginationItem disabled={ isFirst }>
        <PaginationLink href="javascript:;" data-page={ current_page - 1 } onClick={ this.handlePageChange }>
          <i className="fa fa-angle-left"></i>
        </PaginationLink>
      </PaginationItem>
    );
  }

  renderNext() {
    const { current_page, total_pages } = this.props.collection;
    const isLast = current_page === total_pages;

    return (
      <PaginationItem disabled={ isLast }>
        <PaginationLink href="javascript:;" data-page={ current_page + 1 } onClick={ this.handlePageChange }>
          <i className="fa fa-angle-right"></i>
        </PaginationLink>
      </PaginationItem>
    );
  }

  renderLast() {
    const { current_page, total_pages } = this.props.collection;
    const isLast = current_page === total_pages;

    return (
      <PaginationItem disabled={ isLast }>
        <PaginationLink href="javascript:;" data-page={ total_pages } onClick={ this.handlePageChange }>
          <i className="fa fa-angle-double-right"></i>
        </PaginationLink>
      </PaginationItem>
    );
  }

  renderPages() {
    const { current_page, total_pages } = this.props.collection;
    const { linkNum, left, right } = this.state;

    let items = [];

    let end_page = current_page + right;
    if (end_page > total_pages) end_page = total_pages;

    let start_page = current_page - left;
    if (start_page < 1) start_page = 1;

    for (let page = start_page; page <= end_page; page += 1) {
      const active = page === current_page;
      items.push(
        <PaginationItem active={ active } key={page}>
          <PaginationLink href="javascript:;" data-page={page} onClick={ this.handlePageChange }>
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  }

  render() {
    const { total_pages, total_count, current_page, per_page } = this.props.collection;
    if (!total_pages) return null;

    const { go_to_page } = this.state;

    return (
      <Row className='page-footer'>
        <Col xs='11'>
          <Row>
            <Col xs="auto">共{total_count}条</Col>
            <Col xs="auto">
              <Input type="select" onChange={this.handleChangePerPage} value={per_page}>
                <option value="15">每页显示15条</option>
                <option value="30">每页显示30条</option>
                <option value="50">每页显示50条</option>
              </Input>
            </Col>
            <Col xs="auto">
              <Pagination>
                { this.renderFirst() }
                { this.renderPrev() }
                { this.renderPages() }
                { this.renderNext() }
                { this.renderLast() }
              </Pagination>
            </Col>
            <Col xs="auto">共{total_pages}页,</Col>
            <Col xs="auto">到第</Col>
            <Col xs="auto">
              <Input type='text' value={go_to_page} onChange={this.handleChangeGoToPage} onKeyPress={this.handleOnKeyPress} />
            </Col>
            <Col xs="auto">页</Col>
            <Col xs="auto">
              <Button onClick={this.handleClickGoToPage}>确定</Button>
            </Col>
          </Row>
        </Col>
      </Row>
	  );
  }

}
