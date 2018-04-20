/**
 * ### Редактор статьи
 * Форма элемента справочника cat.articles
 *
 * @module Editor
 *
 * Created by Evgeniy Malyarov on 20.04.2018.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Tabs, {Tab} from 'material-ui/Tabs';
import Helmet from 'react-helmet';
import Typography from 'material-ui/Typography';
import { FormGroup, FormControl } from 'material-ui/Form';

import MDNRComponent from 'metadata-react/common/MDNRComponent';
import LoadingMessage from 'metadata-react/DumbLoader/LoadingMessage';
import DataObjToolbar from 'metadata-react/FrmObj/DataObjToolbar';
import DataField from 'metadata-react/DataField';

import {withIface} from 'metadata-redux';

class EditorArticle extends MDNRComponent {

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
      handleAttachment: this.handleAttachment.bind(this),
      handleClose: this.handleClose.bind(this),
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
  }

  handleSave() {
    //this.props.handleSave(this.state._obj);
    const {_obj} = this.state;
    _obj && _obj.save();
  }

  handleAttachment() {

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
    return (_obj && _obj.presentation) || _meta.obj_presentation || _meta.synonym;
  }

  render() {
    const {props: {_mgr, classes}, state: {_obj, _meta, index, MarkdownInput}, context, _handlers} = this;
    const toolbar_props = Object.assign({
      closeButton: !context.dnr,
      posted: _obj && _obj.posted,
      deleted: _obj && _obj.deleted,
      postable: !!(_meta.posted || _mgr.metadata('posted')),
      deletable: false,
    }, _handlers)

    return _obj ? [
      <Helmet key="helmet" title={'Редактор статьи'}/>,

      <Tabs key="tabs" value={index} onChange={(event, index) => this.setState({index})}>
        <Tab label="Реквизиты"/>
        <Tab label="Текст"/>
        <Tab label="Просмотр"/>
      </Tabs>,

      index === 0 && <DataObjToolbar key="toolbar" {...toolbar_props} />,

      index === 0 &&
      <FormGroup key="props">
        0
      </FormGroup>,

      index === 1 && (
        MarkdownInput ?
        <MarkdownInput
          key="content"
          onChange={(val) => {
            _obj._obj.content = val;
            _obj._modified = true;
          }}
          value={_obj.content}
          autoFocus={false}
          readOnly={false}
          showFullScreenButton={false}
          locale='ru'
          ref={(el) => {
            const node = ReactDOM.findDOMNode(el);
            if(node) {
              const toolbar = node && node.querySelector('.react-markdown--toolbar');
              if(toolbar) {
                toolbar.style.display = 'none';
              }
              const content = node && node.querySelector('.react-markdown--slate-content');
              if(content) {
                content.style.minHeight = '200px';
              }
            }
          }}
        />
          :
          <LoadingMessage />
      ),

      index === 2 &&
      <FormGroup key="preview">
        2
      </FormGroup>,

    ]
      :
      <LoadingMessage />;
  }
}

export default withIface(EditorArticle);
