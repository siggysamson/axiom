import React, { Component, PropTypes } from 'react';
import { Example, Snippet } from 'style-guide';
import { Grid, GridCell, ProgressInfinite } from 'bw-axiom';

export default class ProgressExample extends Component {
  static propTypes = {
    components: PropTypes.shape({
      RadialProgress: PropTypes.shape({
        size: PropTypes.shape({
          values: PropTypes.array.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  };

  render() {
    const { components } = this.props;
    const { RadialProgress: { size } } = components;

    return (
      <Example name="ProgressInfinite sizes">
        <Snippet>
          <Grid snippetIgnore={ true }>
            { size.values.map((size) =>
              <GridCell key={ size } shrink={ true } snippetIgnore={ true }>
                <ProgressInfinite size={ size } />
              </GridCell>
            ) }
          </Grid>
        </Snippet>
      </Example>
    );
  }
}
