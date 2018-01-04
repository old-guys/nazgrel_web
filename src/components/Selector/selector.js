import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class Selector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: null,
      options: props.options || [],
      value: null,
      more: true,
      page: 1,
      isLoading: false,
      async: props.async
    };

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
    const {async} = this.state;
    if (!async) return;

    this.setState({
      query: null,
      options: [],
      value: null,
      more: true,
      page: 1
    });
  }

  componentWillReceiveProps(nextProps) {
    const nextValue = nextProps.value;
    const currentValue = this.props.value;

    if (nextValue !== currentValue) {
      this.setState({ value: nextValue });
    }
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
    const {async} = this.state;
    if (!async) return;

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
    const {async} = this.state;
    if (!async) return;

    const { page } = this.state;
    this.fetchOptions({ page: page + 1 });

    if (this.props.onMenuScrollToBottom) this.props.onMenuScrollToBottom(event);
  }

  handleOnInputChange(value) {
    console.log('onInputChange');
    const {async} = this.state;
    if (!async) return;

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
    const {async} = this.state;
    if (!async) return;

    this.setState({
      query: null,
      more: true,
      page: 1,
      options: []
    });
  }

  fetchOptions(params = {}) {
    const { isLoading } = this.state;
    if (isLoading) return;

    const more = params.more || this.state.more;
    const page = params.page || this.state.page;
    const query = _.hasIn(params, 'query') ? params.query : this.state.query;
    const filters = this.filters;
    let options = params.options || this.state.options;

    this.setState({
      page,
      query,
      options,
      more
    });

    if (!more) return null;
    options.push({ id: 0, name: '正在加载......', disabled: true });
    this.setState({ isLoading: true });

    let optimizes = {
      page,
      query,
      filters
    };

    this.fetchData(optimizes).then((res) => {
      if (res.code === 0 || res.code === '0') {
        options.pop();
        this.setState({
          more: !!res.data.next_page,
          options: [...options, ...res.data.models],
          isLoading: false
        });
        this.autoloadNextPageOptions();
      }
    });
  }

  render() {
    const value = this.state.value || this.props.value;
    const multi = _.hasIn(this.props, 'multi') ? this.props.multi : false;
    const valueKey = _.hasIn(this.props, 'valueKey') ? this.props.valueKey : 'id';
    const labelKey = _.hasIn(this.props, 'labelKey') ? this.props.labelKey : 'name';
    const clearable = _.hasIn(this.props, 'clearable') ? this.props.clearable : true;
    const searchable = _.hasIn(this.props, 'searchable') ? this.props.searchable : true;

    return (
      <Select
        isLoading={this.state.isLoading}
        ref={this.selectRef}
        multi={multi}
        name={this.name}
        placeholder={this.placeholder}
        value={value}
        options={this.state.options}
        valueKey={valueKey}
        labelKey={labelKey}
        onChange={this.handleOnChange}
        onFocus={this.handleOnFocus}
        onOpen={this.handleOnOpen}
        onMenuScrollToBottom={this.handleOnMenuScrollToBottom}
        onInputChange={this.handleOnInputChange}
        onBlur={this.handleOnBlur}
        onClose={this.handleOnClose}
        clearable={clearable}
        searchable={searchable}
        disabled={this.props.disabled}
        scrollMenuIntoView={this.scrollMenuIntoView}
        noResultsText="没有找到匹配项"
      />
    );
  }
}
