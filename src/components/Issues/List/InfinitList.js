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
import Chip from '@material-ui/core/Chip';
import withStyles from '@material-ui/core/styles/withStyles';
import cn from 'classnames';

import Status from './Status';

const styles = theme => ({
  root: {
    paddingLeft: theme.spacing.unit / 2,
    paddingRight: theme.spacing.unit / 2,
    borderBottom: '1px lightgray dashed',
    '&:hover': {
      backgroundColor: '#f2f0f0'
    },
  },
  evenRow: {
    backgroundColor: '#f7f7f7',
  },
  row: {
    display: 'flex',
  },
  maxWidth: {
    maxWidth: 'calc(100% - 140px)',
  },
  flex: {
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  canceled: {
    textDecoration: 'line-through',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
  chipRoot: {
    height: 'auto',
    marginRight: theme.spacing.unit / 2,
  },
  cursor: 'pointer',
});

function Row1({row, classes, three, handleFilter, initiator, executor}) {

  return <div className={classes.row}>
    {three && <Status row={row} handleFilter={handleFilter}/>}
    {three ?
      <div className={classes.flex}/>
      :
      <Typography className={cn(classes.flex, row.canceled && classes.canceled, classes.maxWidth)}>{row.caption}</Typography>}
    {!three && <Status row={row} handleFilter={handleFilter}/>}
    {three && <Chip
      tabIndex={-1}
      label={row._area.replace(/^doc$/, 'Личное')}
      className={classes.chip}
      classes={{root: classes.chipRoot}}
      onClick={() => handleFilter('area', row._area)}
    />}
  </div>;
}

function Row2({row, classes, three, handleFilter, initiator, executor}) {
  return <div className={classes.row}>
    {three ?
      <Typography className={cn(classes.flex, row.canceled && classes.canceled)}>{row.caption}</Typography>
      :
      <Typography variant="caption" className={classes.flex}>{row.definition}</Typography>
    }
    <Chip
      tabIndex={-1}
      label={initiator.empty() ? '?' : initiator.id}
      title={initiator.empty() ? 'Инициатор не указан' : `Инициатор: ${initiator.name}`}
      className={classes.chip}
      classes={{root: classes.chipRoot}}
      onClick={() => handleFilter('initiator', row.initiator)}
    />
    {!three && <Chip
      tabIndex={-1}
      label={executor.empty() ? '?' : executor.id}
      title={executor.empty() ? 'Исполнитель не назначен' : `Исполнитель: ${executor.name}`}
      className={classes.chip}
      classes={{root: classes.chipRoot}}
      onClick={() => handleFilter('executor', row.executor)}
    />}
    {!three && <Chip
      tabIndex={-1}
      label={row._area.replace(/^doc$/, 'Личное')}
      className={classes.chip}
      classes={{root: classes.chipRoot}}
      onClick={() => handleFilter('area', row._area)}
    />}
  </div>;
}

function Row3({row, classes, three, handleFilter, executor}) {
  return three && <div className={classes.row}>
    <Typography variant="caption" className={classes.flex}>{row.definition}</Typography>
    <Chip
      tabIndex={-1}
      label={executor.empty() ? '?' : executor.id}
      title={executor.empty() ? 'Исполнитель не назначен' : `Исполнитель: ${executor.name}`}
      className={classes.chip}
      classes={{root: classes.chipRoot}}
      onClick={() => handleFilter('executor', row.executor)}
    />
  </div>;
}

class InfinitList extends React.Component {

  handleFilter = (name, val) => {
    this.context.handleSubFilter(name, val);
  };

  render() {
    const {handleFilter, props: {_list, classes, noContentRenderer, ownerState, ...others}} = this;
    const three = others.rowHeight > 60;
    const {state: {selectedRow}, props: ownerProps, handleEdit} = ownerState();
    const {selectedItem, oddRow} = ownerProps.classes;
    const {users} = $p.cat;

    function rowRenderer({index, key, style}) {

      const rowIndex = index + 1;
      const row = _list[rowIndex];

      if(!row) {
        return null;
      }

      const initiator = users.get(row.initiator);
      const executor = users.get(row.executor);
      const rowProps = {classes, row, three, handleFilter, initiator, executor};

      // оформление ячейки
      const classNames = cn(
        classes.root,
        rowIndex !== selectedRow && (rowIndex % 2 === 0 ? classes.evenRow : oddRow),
        rowIndex === selectedRow && selectedItem);

      return <div
        key={key}
        style={style}
        className={classNames}
        onClick={() => ownerState({selectedRow: rowIndex})}
        onDoubleClick={handleEdit}
      >
        <Row1 {...rowProps}/>
        <Row2 {...rowProps}/>
        <Row3 {...rowProps}/>
      </div>;
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

const rowPropTypes = {
  row: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  three: PropTypes.bool.isRequired,
  handleFilter: PropTypes.func.isRequired,
  initiator: PropTypes.object.isRequired,
  executor: PropTypes.object.isRequired,
};

Row1.propTypes = rowPropTypes;
Row2.propTypes = rowPropTypes;
Row3.propTypes = rowPropTypes;

export default withStyles(styles)(InfinitList);

// rowRenderer.propTypes = {
//   index: PropTypes.number.isRequired,
//   key: PropTypes.string.isRequired,
//   style: PropTypes.object.isRequired,
// };

