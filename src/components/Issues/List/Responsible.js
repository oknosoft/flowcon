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

class Responsible extends React.Component {

  constructor(props, context) {
    super(props, context);
    const t = this;
    this._meta = Object.assign({}, $p.doc.issue.metadata('initiator'), {synonym: 'Ответственный'});
    this._obj = {
      _manager: $p.cat.users,
      _value: props.responsible ? props.responsible.valueOf() : $p.utils.blank.guid,
      get value() {
        return this._manager.get(this._value);
      },
      set value(v) {
        v = this._manager.get(v);
        this._value = v.valueOf();
        t.props.responsible != v && props.onChange(v);
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

Responsible.propTypes = {
  onChange: PropTypes.func.isRequired,
  responsible: PropTypes.object,
};

export default Responsible;
