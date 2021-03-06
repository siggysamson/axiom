import React, { Component, Children, PropTypes, cloneElement } from 'react';
import classnames from 'classnames';
import { Base, ButtonIcon } from 'bw-axiom';

if (__INCLUDE_CSS__) {
  require('./Button.scss');
}

export default class Button extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    full: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.oneOf(['small', 'medium', 'large']),
    ]),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    style: PropTypes.oneOf(['primary', 'secondary', 'tertiary']),
  };

  static contextTypes = {
    joined: PropTypes.bool,
  };

  static defaultProps = {
    style: 'primary',
    size: 'medium',
  };

  render() {
    const { joined } = this.context;
    const { children, style, size, full, ...rest } = this.props;
    const childrenArray = Children.toArray(children);
    const iconOnly = childrenArray.length === 1 && childrenArray[0].type === ButtonIcon;
    const classes = classnames('ax-button', {
      [`ax-button--${size}`]: size,
      [`ax-button--${style}`]: style,
      'ax-button--joined': joined,
      'ax-button--icon-only': iconOnly,
      'ax-button--full': full === true,
      [`ax-button--full--${full}`]: typeof full === 'string',
    });

    const mappedChildren = childrenArray.map((child, index, array) =>
      child.type !== ButtonIcon ? child : cloneElement(child, {
        isEnd: index === array.length - 1,
        isStart: index === 0,
      })
    );

    return (
      <Base Component="button" { ...rest } className={ classes }>
        { mappedChildren }
      </Base>
    );
  }
}
