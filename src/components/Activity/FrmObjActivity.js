/**
 * ### Настройка активности
 * Форма элемента справочника cat.Activity
 *
 * @module FrmObjActivity
 *
 * Created by Evgeniy Malyarov on 02.12.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import FormGroup from '@material-ui/core/FormGroup';


import MDNRComponent from 'metadata-react/common/MDNRComponent';
import LoadingMessage from 'metadata-react/DumbLoader/LoadingMessage';
import DataObjToolbar from 'metadata-react/FrmObj/DataObjToolbar';
import DataField from 'metadata-react/DataField';

import withStyles from 'metadata-react/styles/paper600';
import {withIface} from 'metadata-redux';

const htitle = 'Настройка активности';

class FrmObjActivity extends MDNRComponent {

  constructor(props, context) {
    super(props, context);
    const {_mgr, _meta} = props;
    this._handlers = {
      handleSave: this.handleSave.bind(this),
      handleClose: this.handleClose.bind(this),
      handleSaveClose: this.handleSaveClose.bind(this),
      handleMarkDeleted: this.handleMarkDeleted.bind(this),
    };
    this.state = {
      _meta: _meta || _mgr.metadata(),
      _obj: null,
    };
  }

  componentDidMount() {
    const t = this;
    const {_mgr, match} = this.props;
    this._mounted = true;
    _mgr.get(match.params.ref, 'promise').then((_obj) => {
      this.setState({_obj}, () => this.shouldComponentUpdate(this.props));
    });
    this.onDataChange = function(obj, fields) {
      if(obj === t.state._obj && t._mounted && t.shouldComponentUpdate(t.props)) {
        t.forceUpdate();
      }
    };
    _mgr.on('update', this.onDataChange);
  }

  componentWillUnmount() {
    this._mounted = false;
    this.props._mgr.off('update', this.onDataChange);
  }

  handleSave() {
    //this.props.handleSave(this.state._obj);
    const {_obj} = this.state;
    return _obj ? _obj.save()
        .then(() => {
          this.shouldComponentUpdate(this.props);
          return false;
        })
        .catch((err) => {
          // показываем диалог
          this.props.handleIfaceState({
            component: '',
            name: 'alert',
            value: {open: true, title: _obj.presentation, text: err.reason || err.message}
          });
        })
      :
      Promise.resolve(true);
  }

  handleClose() {
    const {handlers, _mgr} = this.props;
    const {_obj} = this.state;
    handlers.handleNavigate(`/${_mgr.class_name}/list${_obj ? '/?ref=' + _obj.ref : ''}`);
  }

  handleSaveClose() {
    this.handleSave()
      .then((res) => {
        typeof res === 'boolean' && this.handleClose();
      });
  }

  handleMarkDeleted() {

  }

  handleValueChange(_fld) {
    return (event, value) => {
      const {_obj, handlers} = this.props;
      const old_value = _obj[_fld];
      _obj[_fld] = (value || (event && event.target ? event.target.value : ''));
      handlers.handleValueChange(_fld, old_value);
    };
  }

  get ltitle() {
    const {_meta, _obj} = this.state;
    let ltitle = (_obj && _obj.presentation) || _meta.obj_presentation || _meta.synonym;
    if(_obj && _obj._modified && ltitle[ltitle.length - 1] !== '*') {
      ltitle += ' *';
    }
    return ltitle;
  }

  render() {
    const {props: {classes}, state: {_obj}, context, _handlers} = this;
    const toolbar_props = Object.assign({
      closeButton: !context.dnr,
      deleted: _obj && _obj.deleted,
      postable: false,
      deletable: false,
      handleAttachments: () => null,
    }, _handlers);

    return _obj ? [
        <Helmet key="helmet" title={htitle}>
          <meta name="description" content={htitle} />
          <meta property="og:title" content={htitle} />
          <meta property="og:description" content={htitle} />
        </Helmet>,

        <DataObjToolbar key="toolbar" {...toolbar_props} />,

        <FormGroup row key="fields" className={classes.spaceLeft}>

          <FormGroup className={classes.fullFlex}>
            <DataField _obj={_obj} _fld="name"/>
            <DataField _obj={_obj} _fld="flow" fullWidth/>
            <DataField _obj={_obj} _fld="use"/>
            <DataField _obj={_obj} _fld="sorting_field" fullWidth/>
            <DataField _obj={_obj} _fld="plan" fullWidth/>
            <DataField _obj={_obj} _fld="period" fullWidth/>
            <DataField _obj={_obj} _fld="by_default" fullWidth/>
          </FormGroup>

          <FormGroup className={classes.rightWidth}>
            <DataField _obj={_obj} _fld="health"/>
            <DataField _obj={_obj} _fld="work"/>
            <DataField _obj={_obj} _fld="family"/>
            <DataField _obj={_obj} _fld="humanity"/>
            <DataField _obj={_obj} _fld="personal"/>
          </FormGroup>

        </FormGroup>,

      ]
      :
      <LoadingMessage />;
  }
}

FrmObjActivity.propTypes = {
  _mgr: PropTypes.object,             // DataManager, с которым будет связан компонент
  _acl: PropTypes.string,             // Права на чтение-изменение
  _meta: PropTypes.object,            // Здесь можно переопределить метаданные
  _layout: PropTypes.object,          // Состав и расположение полей, если не задано - рисуем типовую форму

  read_only: PropTypes.object,        // Элемент только для чтения

  handlers: PropTypes.object.isRequired, // обработчики редактирования объекта
};

export default withStyles(withIface(FrmObjActivity));
