/**
 * ### Редактор статьи
 * Форма элемента справочника cat.articles
 *
 * @module Editor
 *
 * Created by Evgeniy Malyarov on 20.04.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Tabs, {Tab} from 'material-ui/Tabs';
import Helmet from 'react-helmet';
import {FormGroup} from 'material-ui/Form';

import MDNRComponent from 'metadata-react/common/MDNRComponent';
import LoadingMessage from 'metadata-react/DumbLoader/LoadingMessage';
import DataObjToolbar from 'metadata-react/FrmObj/DataObjToolbar';
import FrmAttachments from 'metadata-react/FrmAttachments';
import DataField from 'metadata-react/DataField';
import SelectTags from '../Articles/SelectTags';

import withStyles from 'metadata-react/styles/paper600';
import {withIface} from 'metadata-redux';

const htitle = 'Задача';

class FrmObjIssue extends MDNRComponent {

  static propTypes = {
    _mgr: PropTypes.object,             // DataManager, с которым будет связан компонент
    _acl: PropTypes.string,             // Права на чтение-изменение
    _meta: PropTypes.object,            // Здесь можно переопределить метаданные
    _layout: PropTypes.object,          // Состав и расположение полей, если не задано - рисуем типовую форму

    read_only: PropTypes.object,        // Элемент только для чтения

    handlers: PropTypes.object.isRequired, // обработчики редактирования объекта
  };

  constructor(props, context) {
    super(props, context);
    const {_mgr, _meta} = props;
    this._handlers = {
      handleSave: this.handleSave.bind(this),
      handleClose: this.handleClose.bind(this),
      handleMarkDeleted: this.handleMarkDeleted.bind(this),
    };
    this.state = {
      _meta: _meta || _mgr.metadata(),
      _obj: null,
      MarkdownInput: null,
      index: 0,
    };
  }

  componentDidMount() {
    const {_mgr, match} = this.props;
    _mgr.get(match.params.ref, 'promise').then((_obj) => {
      this.setState({_obj}, () => this.shouldComponentUpdate(this.props));
    });
    import('@opuscapita/react-markdown')
      .then((module) => {
        this.setState({MarkdownInput: module.default});
      });

    _mgr.on('update', this.onDataChange);
  }

  componentWillUnmount() {
    this.props._mgr.off('update', this.onDataChange);
  }

  /* eslint-disable-next-line*/
  onDataChange = (obj, fields) => {
    if(obj === this.state._obj) {
      this.shouldComponentUpdate(this.props);
    }
  }

  handleSave() {
    //this.props.handleSave(this.state._obj);
    const {_obj} = this.state;
    _obj && _obj.save()
      .then(() => this.shouldComponentUpdate(this.props))
      .catch((err) => {
        // показываем диалог
        this.props.handleIfaceState({
          component: '',
          name: 'alert',
          value: {open: true, title: _obj.presentation, text: err.reason || err.message}
        });
      });
  }


  handleMarkDeleted() {

  }

  handleClose() {
    const {handlers, _mgr} = this.props;
    const {_obj} = this.state;
    handlers.handleNavigate(`/${_mgr.class_name}/list${_obj ? '/?ref=' + _obj.ref : ''}`);
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

  editorStyles(el) {
    const content = el && el.querySelector('.react-markdown--slate-content');
    if(content) {
      content.style.minHeight = '140px';
    }
  }

  tagsChange = ({target}) => {
    const {state: {_obj}} = this;
    _obj.tags = target.value;
    _obj._modified = true;
    this.forceUpdate();
  };

  renderFields(_obj, classes) {
    return (
      <FormGroup key="props" className={classes.spaceLeft}>
        <FormGroup row>
          <DataField _obj={_obj} _fld="number_doc"/>
          <DataField _obj={_obj} _fld="date"/>
          <DataField _obj={_obj} _fld="responsible"/>
        </FormGroup>
        <DataField _obj={_obj} _fld="caption" fullWidth/>
        <SelectTags tags={_obj.tags} handleChange={this.tagsChange}/>
      </FormGroup>
    );
  }

  render() {
    const {
      props: {_mgr, classes, handleIfaceState},
      state: {_obj, _meta, index, MarkdownInput},
      context, _handlers} = this;
    const toolbar_props = Object.assign({
      closeButton: !context.dnr,
      posted: _obj && _obj.posted,
      deleted: _obj && _obj.deleted,
      postable: !!(_meta.posted || _mgr.metadata('posted')),
      deletable: false,
    }, _handlers);

    return _obj ? [
      <Helmet key="helmet" title={htitle}/>,

      <Tabs key="tabs" value={index} onChange={(event, index) => this.setState({index})}>
        <Tab label="Реквизиты"/>
        <Tab label="Текст"/>
        <Tab label="Вложения"/>
      </Tabs>,

      index === 0 && <DataObjToolbar key="toolbar" {...toolbar_props} />,

      index === 0 && this.renderFields(_obj, classes),

      index === 1 && (
        MarkdownInput ?
          <div key="definition" ref={this.editorStyles}>
            <MarkdownInput
              onChange={(val) => {
                _obj._obj.definition = val;
                _obj._modified = true;
              }}
              value={_obj.definition}
              autoFocus={false}
              readOnly={false}
              showFullScreenButton={false}
              hideToolbar
              locale='ru'
            />
          </div>
          :
          <LoadingMessage key="loading" />
      ),

      index === 2 && <FrmAttachments key="attachments" _obj={_obj} handleIfaceState={handleIfaceState}/>,

    ]
      :
      <LoadingMessage />;
  }
}

export default withStyles(withIface(FrmObjIssue));
