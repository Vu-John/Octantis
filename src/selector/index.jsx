import React, { Component } from 'react';
import { Select } from '@shopify/polaris';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = { selected: undefined, options: [] }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.setValuesFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
      this.setValuesFromProps(nextProps);
    }

  setValuesFromProps(props) {
    const options = [];
    var selected;
    _.forEach(props.options, (opt, idx) => {
      options.push({ label: opt.label, value: idx });
      if ((props.value !== undefined) && (props.value === opt.value)) {
        selected = idx;
      }
    });
    this.setState({ options, selected });
  }

  handleChange(val) {
    val = Number(val);
    this.setState({ selected: val });
    this.props.onChange(this.props.options[val].value);
  }

  render() {
    const { label, disabled } = this.props;
    const { options, selected } = this.state;

    return (
      <Select
        placeholder={"Select a " + label.toLowerCase()}
        disabled={disabled}
        label={label}
        options={options}
        onChange={this.handleChange}
        value={selected}
      />
    );
  }
}

Selector.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.bool
  ]),
  options: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool
};

export default Selector;