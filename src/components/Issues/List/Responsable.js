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

class Responsable extends React.Component {

  constructor(props, context) {
    super(props, context);
    const t = this;
    this._meta = Object.assign({}, $p.doc.issue.metadata('initiator'), {synonym: 'Ответственный'});
    this._obj = {
      _manager: $p.cat.users,
      _value: props.reaponsable ? props.reaponsable.valueOf() : $p.utils.blank.guid,
      get value() {
        return this._manager.get(this._value);
      },
      set value(v) {
        v = this._manager.get(v);
        this._value = v.valueOf();
        t.props.reaponsable != v && props.onChange(v);
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

Responsable.propTypes = {
  onChange: PropTypes.func.isRequired,
  reaponsable: PropTypes.object,
};

export default Responsable;
