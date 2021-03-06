import { Component, PropTypes, cloneElement } from 'react';

export default class TooltipContent extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    const { children, ...rest } = this.props;
    return cloneElement(children, rest);
  }
}
