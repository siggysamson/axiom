import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { Icon, TextInput } from 'axiom/react';
import { debounce } from 'style-guide/utils/function';

export default class SearchInput extends Component {
  static propTypes = {
    locationState: PropTypes.shape({
      query: PropTypes.object.isRequired,
    }).isRequired,
    searchState: PropTypes.shape({
      isSearching: PropTypes.bool.isRequired,
    }).isRequired,
    searchActions: PropTypes.shape({
      searchRoutes: PropTypes.func.isRequired,
    }).isRequired,
  };

  componentWillMount() {
    this.updateSearchTextDebounced = debounce(::this.updateSearchText);
  }

  onChangeHandler(event) {
    event.persist();
    this.updateSearchTextDebounced(event);
  }

  updateSearchText(event) {
    const {target: {value}} = event;
    const {searchActions: {searchRoutes}} = this.props;

    if (value) {
      searchRoutes(value);
    }
  }

  render() {
    const {
      locationState: {query: {q}},
      searchState: {isSearching},
    } = this.props;

    return (
      <TextInput
        placeholder="Looking for something?"
        defaultValue={q}
        thinking={isSearching}
        onChange={::this.onChangeHandler}>
        <Icon name="search" />
      </TextInput>
    );
  }
};
