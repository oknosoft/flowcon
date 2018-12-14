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
import {Prompt} from 'react-router-dom';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import qs from 'qs';

import MDNRComponent from 'metadata-react/common/MDNRComponent';
import LoadingMessage from 'metadata-react/DumbLoader/LoadingMessage';
import DataObjToolbar from 'metadata-react/FrmObj/DataObjToolbar';
import DataField from 'metadata-react/DataField';
import FieldSelectStatic  from 'metadata-react/DataField/FieldSelectStatic';
import withStyles from 'metadata-react/styles/paper600';
import {withIface} from 'metadata-redux';

import options  from './activity_options';
import {categories} from './activity_options';

const {cat: {tags_category}} = $p;
const empty_cat = tags_category.get();
empty_cat.name = 'Не указан';
const cat_list = categories.concat(empty_cat);

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
    this.onDataChange = function(obj) {
      if(obj === t.state._obj && t._mounted && t.shouldComponentUpdate(t.props)) {
        t.forceUpdate();
      }
    };
    _mgr.on('update', this.onDataChange);
  }

  componentWillUnmount() {
    const {_obj} = this.state;
    this._mounted = false;
    this.props._mgr.off('update', this.onDataChange);
    if(_obj && _obj.is_new() && !_obj.empty()) {
      _obj.unload();
    }
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
            value: {open: true, title: _obj.presentation || _obj._metadata().obj_presentation, text: err.reason || err.message}
          });
        })
      :
      Promise.resolve(true);
  }

  handleClose() {
    const {props: {handlers, _mgr, location}, state: {_obj}} = this;
    const prm = qs.parse(location.search.replace('?',''));
    handlers.handleNavigate(prm.urlback || `/${_mgr.class_name}/list${_obj ? '/?ref=' + _obj.ref : ''}`);
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

  /**
   * проверка, можно ли покидать страницу
   * @param loc
   * @return {*}
   */
  prompt = (/*loc*/) => {
    return this.state._obj._modified ? `Объект изменен.\n\nЗакрыть без сохранения?` : true;
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
      !context.dnr && <Helmet key="helmet" title={htitle}>
        <meta name="description" content={htitle} />
        <meta property="og:title" content={htitle} />
        <meta property="og:description" content={htitle} />
      </Helmet>,

      !context.dnr && <Prompt key="prompt" when message={this.prompt} />,

      <DataObjToolbar key="toolbar" {...toolbar_props} />,

      <FormGroup row key="fields" className={classes.spaceLeft}>

        <FormGroup>
          <FormLabel className={classes.paddingTop}>Реквизиты</FormLabel>
          <DataField _obj={_obj} _fld="name"/>
          <FieldSelectStatic _obj={_obj} _fld="flow" options={cat_list}/>
          <DataField _obj={_obj} _fld="use"/>
          <DataField _obj={_obj} _fld="sorting_field"/>
          {/*
          <DataField _obj={_obj} _fld="plan" fullWidth/>
          <DataField _obj={_obj} _fld="period" fullWidth/>
          <DataField _obj={_obj} _fld="by_default" fullWidth/>
          */}
        </FormGroup>

        <FormGroup className={classes.rightWidth}>
          <FormLabel className={classes.paddingTop}>Вклад в потоки</FormLabel>
          <FieldSelectStatic _obj={_obj} _fld="health" options={options}/>
          <FieldSelectStatic _obj={_obj} _fld="work" options={options}/>
          <FieldSelectStatic _obj={_obj} _fld="family" options={options}/>
          <FieldSelectStatic _obj={_obj} _fld="humanity" options={options}/>
          <FieldSelectStatic _obj={_obj} _fld="personal" options={options}/>
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
