/**
 * ### Панель параметрв
 * для отчета _Движение денег_
 *
 * Created 09.01.2017
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import FormGroup from '@material-ui/core/FormGroup';
import DataListField from 'metadata-react/DataListField';
import FieldDateRange from 'metadata-react/DataField/FieldDateRange';

export default class RepParams extends Component {

  static propTypes = {
    _obj: PropTypes.object.isRequired,  // DataObj (отчет)
    minHeight: PropTypes.number,
    scheme: PropTypes.object,
  };

  render() {

    const {_obj, scheme, minHeight} = this.props;

    return (
      <FormGroup style={{height: minHeight || 356, margin: 8}}>

        <FieldDateRange _obj={scheme} _fld="date" _meta={{synonym: 'Период'}} />

        <DataListField _tabular={_obj.cashboxes} _fld="cashbox" _meta={_obj._metadata('cashboxes')} />

        <DataListField _tabular={_obj.cash_flow_articles} _fld="cash_flow_article" _meta={_obj._metadata('cash_flow_articles')} />

      </FormGroup>
    );

  }
}
