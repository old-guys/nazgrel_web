import React from 'react';
import ReactDOM from 'react-dom';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

export default class Paginator extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      linkNum: 5,
      left: 2,
      right: 2
    }
  }

  handlePageChange(event) {
    let current_page = event.currentTarget.getAttribute('data-page');
    current_page = Number(current_page);

    this.props.handlePageChange(current_page);
    this.setState({ current_page });
  }

  renderFirst() {
    const { current_page } = this.props.collection;
    const isFirst = current_page === 1;

    return (
      <PaginationItem disabled={ isFirst }>
        <PaginationLink href="javascript:;" data-page="1" onClick={ this.handlePageChange.bind(this) }>
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
        <PaginationLink href="javascript:;" data-page={ current_page - 1 } onClick={ this.handlePageChange.bind(this) }>
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
        <PaginationLink href="javascript:;" data-page={ current_page + 1 } onClick={ this.handlePageChange.bind(this) }>
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
        <PaginationLink href="javascript:;" data-page={ total_pages } onClick={ this.handlePageChange.bind(this) }>
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
          <PaginationLink href="javascript:;" data-page={page} onClick={ this.handlePageChange.bind(this) }>
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  }

  updateAttrs() {
    const models = this.props.collection.models || [];
    let { current_page, next_page, per_page, total_count, total_pages } = this.props.collection;

    if (_.isUndefined(current_page)) current_page = 1;
    if (_.isUndefined(next_page)) next_page = current_page + 1;
    if (_.isUndefined(per_page)) per_page = this.state.per_page;
    if (_.isUndefined(total_count)) total_count = models.count;
    if (_.isUndefined(total_pages)) total_pages = Math.ceil(total_count / per_page);

    this.setState({
      current_page,
      next_page,
      per_page,
      total_count,
      total_pages
    })
  }

  render() {
    const { total_pages } = this.props.collection;

    if (!total_pages) return null;

    return (
      <Pagination>
        { this.renderFirst() }
        { this.renderPrev() }
        { this.renderPages() }
        { this.renderNext() }
        { this.renderLast() }
      </Pagination>
	  );
  }

}
