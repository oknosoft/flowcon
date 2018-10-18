/**
 *
 *
 * @module SelectMgr
 *
 * Created by Evgeniy Malyarov on 16.10.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import DataField from 'metadata-react/DataField';

class Reaponsable extends React.Component {

  constructor(props, context) {
    super(props, context);
    const {cat, utils} = $p;
    this._meta = Object.assign({}, $p.doc.issue.metadata('initiator'), {synonym: 'Ответственный'});
    this._obj = {
      _manager: cat.users,
      _value: utils.blank.guid,
      get value() {
        return this._manager.get(this._value);
      },
      set value(v) {
        this._value = v.valueOf();
        props.onChange(this.value);
      }
    };
  }

  render() {
    return <DataField
      _obj={this._obj}
      _meta={this._meta}
      _fld="value"
      bar
      label_position={$p.enm.label_positions.hide}
    />;
  }
}

Reaponsable.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default Reaponsable;
