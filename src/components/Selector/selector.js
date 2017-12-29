import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class Selector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: null,
      options: [],
      value: null,
      more: true,
      page: 1
    }

    this.multi = props.multi || false;
    this.clearable= props.clearable || true;
    this.searchable= props.searchable || true;
    this.filters = props.filters;

    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleOnOpen = this.handleOnOpen.bind(this);
    this.handleOnMenuScrollToBottom = this.handleOnMenuScrollToBottom.bind(this);
    this.handleOnInputChange = this.handleOnInputChange.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleOnClose = this.handleOnClose.bind(this);
  }

  componentDidMount() {
    console.log(this.selectRef);
  }

  componentWillUnmount() {
    this.setState({
      query: null,
      options: [],
      value: null,
      more: true,
      page: 1
    });
  }

  handleOnChange(values) {
    console.log('onChange');

    this.setState({ value: values });
    if (this.props.onChange) this.props.onChange(values);
  }

  handleOnFocus(event) {
    console.log('onFocus');
  }

  handleOnOpen(event) {
    console.log('onOpen');

    this.fetchOptions({
      page: 1,
      more: true,
      options: []
    });

    if (this.props.onOpen) this.props.onOpen(event);
  }

  autoloadNextPageOptions() {
    const { value, options, more, page } = this.state;

    const unselectedOptions = _.filter(options, (n) => {
      return !_.some(value, { id: n.id });
    });

    if (unselectedOptions.length < 5 && more) {
      this.fetchOptions({ page: page + 1 });
    }
  }

  handleOnMenuScrollToBottom(event) {
    console.log('onMenuScrollToBottom');

    const { page } = this.state;
    this.fetchOptions({ page: page + 1 });

    if (this.props.onMenuScrollToBottom) this.props.onMenuScrollToBottom(event);
  }

  handleOnInputChange(value) {
    console.log('onInputChange');

    setTimeout(() => {
      const dom = this.refs[this.selectRef];

      if (dom.state.isOpen) {
        this.fetchOptions({
          query: value,
          more: true,
          page: 1,
          options: []
        });
      }

      if (this.props.onInputChange) this.props.onInputChange(value);
    }, 0);
  }

  handleOnBlur(event) {
    console.log('onBlur');
  }

  handleOnClose(event) {
    console.log('onClose');

    this.setState({
      query: null,
      more: true,
      page: 1,
      options: []
    });
  }

  fetchOptions(params = {}) {
    const options = params.options || this.state.options;
    const more = params.more || this.state.more;
    const page = params.page || this.state.page;
    const query = _.hasIn(params, 'query') ? params.query : this.state.query;
    const filters = this.filters;

    this.setState({
      page,
      query,
      options,
      more
    });

    if (!more) return null;

    let optimizes = {
      page,
      query,
      filters
    };

    this.fetchData(optimizes).then((res) => {
      if (res.code === 0 || res.code === '0') {
        this.setState({
          more: !!res.data.next_page,
          options: [...options, ...res.data.models]
        });
        this.autoloadNextPageOptions();
      }
    });
  }

  render() {
    const value = this.state.value || this.props.value;

    return (
      <Select
        ref={this.selectRef}
        multi={this.multi}
        name={this.name}
        placeholder={this.placeholder}
        value={value}
        options={this.state.options}
        valueKey="id"
        labelKey="name"
        onChange={this.handleOnChange}
        onFocus={this.handleOnFocus}
        onOpen={this.handleOnOpen}
        onMenuScrollToBottom={this.handleOnMenuScrollToBottom}
        onInputChange={this.handleOnInputChange}
        onBlur={this.handleOnBlur}
        onClose={this.handleOnClose}
        clearable={this.clearable}
        searchable={this.searchable}
        scrollMenuIntoView={this.scrollMenuIntoView}
        noResultsText="没有找到匹配项"
      />
    );
  }
}
