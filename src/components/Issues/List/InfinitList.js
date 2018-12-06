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
import Responsables from './Responsables';

const styles = theme => ({
  root: {
    paddingRight: theme.spacing.unit / 2,
    borderBottom: '1px whitesmoke solid',
    '&:hover': {
      backgroundColor: 'whitesmoke'
    },
  },
  row: {
    display: 'flex',
  },
  flex: {
    flex: 1,
    whiteSpace: 'nowrap',
    maxWidth: 'calc(100% - 180px)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  canceled: {
    textDecoration: 'line-through',
  }
});

class InfinitList extends React.Component {

  handleFilter = (name) => {
    this.context.handleSubFilter(name);
  };

  render() {
    const {handleFilter, props: {_list, classes, noContentRenderer, ...others}} = this;
    const three = others.rowHeight > 60;

    function rowRenderer({index, key, style}) {

      const row = _list[index + 1];

      return row ?
        <div key={key} style={style} className={classes.root}>
          <div className={classes.row}>
            <Status row={row} handleFilter={handleFilter}/>
            {three ?
              <div className={classes.flex}/>
              :
              <Typography className={cn(classes.flex, row.canceled && classes.canceled)}>{row.caption}</Typography>}
            <Typography>{row._area.replace(/^doc$/, 'Личное')}</Typography>
          </div>
          <div className={classes.row}>
            <Responsables row={row}/>
            {three ?
              <Typography className={cn(classes.flex, row.canceled && classes.canceled)}>{row.caption}</Typography>
              :
              <Typography variant="caption" className={classes.flex}>{row.definition}</Typography>
            }
          </div>
          {three && <Typography variant="caption" className={classes.flex}>{row.definition}</Typography>}
        </div>
        :
        null;
    }

    return _list.length <= 1 ?
      <div style={{width: others.width}}>{noContentRenderer()}</div>
      :
      <List {...others} rowRenderer={rowRenderer} />;
  }
}

InfinitList.contextTypes = {
  handleSubFilter: PropTypes.func,
};

export default withStyles(styles)(InfinitList);

// rowRenderer.propTypes = {
//   index: PropTypes.number.isRequired,
//   key: PropTypes.string.isRequired,
//   style: PropTypes.object.isRequired,
// };

