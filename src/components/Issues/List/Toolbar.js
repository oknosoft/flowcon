import React from 'react';

/**
 * Панель инструментов
 *
 * @module Toolbar
 *
 * Created by Evgeniy Malyarov on 27.11.2018.
 */

import Toolbar from '@material-ui/core/Toolbar';
import withStyles from 'metadata-react/Header/toolbar';
import SearchBox from 'metadata-react/SchemeSettings/SearchBox';
import Responsable from './Responsable';

class Toolbar2 extends React.Component {

  handleSearchChange = ({target, force}) => {
    const {handleFilterChange, scheme} = this.props;
    if(scheme._search !== target.value.toLowerCase() || force) {
      scheme._search = target.value.toLowerCase();
      this._timer && clearTimeout(this._timer);
      if(force) {
        handleFilterChange();
      }
      else {
        this._timer = setTimeout(handleFilterChange, 300);
      }
      this.forceUpdate();
    }
  };

  render() {
    const {classes, reaponsable, handleReaponsable, scheme, children} = this.props;
    return <Toolbar disableGutters className={classes.toolbar}>
      <Responsable reaponsable={reaponsable} onChange={handleReaponsable}/>
      <SearchBox
        value={scheme._search || ''}
        onChange={this.handleSearchChange}
      />
    </Toolbar>
  }

}


export default withStyles(Toolbar2);
