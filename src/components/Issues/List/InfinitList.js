/**
 * Динамический список задач
 *
 * @module InfinitList
 *
 * Created by Evgeniy Malyarov on 27.11.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import List from 'react-virtualized/dist/es/List';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import cn from 'classnames';

import Status from './Status';

const styles = theme => ({
  root: {
    display: 'flex',
    paddingRight: theme.spacing.unit / 2,
    borderBottom: '1px whitesmoke solid',
    '&:hover': {
      backgroundColor: 'whitesmoke'
    },
  },
  flex: {
    flex: 1,
    whiteSpace: 'nowrap',
    maxWidth: 'calc(100% - 160px)',
  },
  canceled: {
    textDecoration: 'line-through',
  }
});

class InfinitList extends React.Component {

  render() {
    const {_list, classes, ...others} = this.props;

    function rowRenderer({index, key, style}) {

      const row = _list[index + 1];

      return row ?
        <div key={key} style={style} className={classes.root}>
          <Status row={row}/>
          <Typography className={cn(classes.flex, row.canceled && classes.canceled)}>{row.caption}</Typography>
          {row._area.replace(/^doc$/, 'Личное')}
        </div>
        :
        null;
    }

    return <List {...others} rowRenderer={rowRenderer} />;
  }
}
export default withStyles(styles)(InfinitList);

// rowRenderer.propTypes = {
//   index: PropTypes.number.isRequired,
//   key: PropTypes.string.isRequired,
//   style: PropTypes.object.isRequired,
// };

