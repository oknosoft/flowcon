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
import Helmet from 'react-helmet';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';

import MDNRComponent from 'metadata-react/common/MDNRComponent';
import LoadingMessage from 'metadata-react/DumbLoader/LoadingMessage';
import DataObjToolbar from 'metadata-react/FrmObj/DataObjToolbar';
import FrmAttachments from 'metadata-react/FrmAttachments';
import DataField from 'metadata-react/DataField';
import TabularSection from 'metadata-react/TabularSection';
import MenuItem from '@material-ui/core/MenuItem';

import withStyles from 'metadata-react/styles/paper600';
import {withIface} from 'metadata-redux';

const htitle = 'Задача';

class FrmObjIssue extends MDNRComponent {

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
      MarkdownInput: null,
    };
    // в редакторе доступны все категории
    this.tagList = [];
    $p.cat.tags.forEach((tag) => {
      this.tagList.push(tag);
    });
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
      if(this.shouldComponentUpdate(this.props)) {
        this.forceUpdate();
      }
    }
  }

  handleSave() {
    //this.props.handleSave(this.state._obj);
    const {_obj} = this.state;
    return _obj ? _obj.save()
      .then(() => this.shouldComponentUpdate(this.props))
      .catch((err) => {
        // показываем диалог
        this.props.handleIfaceState({
          component: '',
          name: 'alert',
          value: {open: true, title: _obj.presentation, text: err.reason || err.message}
        });
      })
      :
      Promise.resolve();
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

  editorStyles(el) {
    const content = el && el.querySelector('.react-markdown--slate-content');
    if(content) {
      content.style.minHeight = '120px';
      const {style} = el.querySelector('.react-markdown--slate-editor');
      style.marginRight = '8px';
    }
  }

  tagsChange = ({target}) => {
    const {state: {_obj}} = this;
    _obj.tags = target.value;
    _obj._modified = true;
    this.forceUpdate();
  };

  render() {
    const {
      props: {_mgr, classes, handleIfaceState},
      state: {_obj, _meta, MarkdownInput},
      context, _handlers} = this;
    const toolbar_props = Object.assign({
      closeButton: !context.dnr,
      deleted: _obj && _obj.deleted,
      postable: false,
      deletable: false,
      handleAttachments: () => null,
      menu_buttons: <MenuItem
        onClick={null}
        title="Идентификатор в github или иной программе">
        Внешний ID
      </MenuItem>,
    }, _handlers);

    return _obj ? [
      <Helmet key="helmet" title={htitle}>
        <meta name="description" content="Редактор задачи" />
        <meta property="og:title" content={htitle} />
        <meta property="og:description" content="Редактор задачи" />
      </Helmet>,

      <DataObjToolbar key="toolbar" {...toolbar_props} />,

      <FormGroup row key="fields" className={classes.spaceLeft}>

        <FormGroup className={classes.fullFlex}>
          <DataField _obj={_obj} _fld="caption"/>
          <FormGroup row>
            <DataField _obj={_obj} _fld="initiator"/>
            <DataField _obj={_obj} _fld="executor"/>
          </FormGroup>

          { MarkdownInput ?
            <div key="definition" ref={this.editorStyles}>
              <Typography variant="caption" color="textSecondary" className={classes.paddingTop}>Описание задачи</Typography>
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
          }

        </FormGroup>

        <FormGroup>
          <DataField _obj={_obj} _fld="date" read_only/>
          <DataField _obj={_obj} _fld="quickly" ctrl_type="threestate" labels={['Не срочно', 'Срочность не задана', 'Срочно']}/>
          <DataField _obj={_obj} _fld="important" ctrl_type="threestate" labels={['Не важно', 'Важность не задана', 'Важно']}/>
          <DataField _obj={_obj} _fld="mark"/>
          {!_obj.specify && <DataField _obj={_obj} _fld="executor_accepted"/>}
          {!_obj.executor_accepted && <DataField _obj={_obj} _fld="specify"/>}
          {!_obj.canceled && _obj.executor_accepted && <DataField _obj={_obj} _fld="completed"/>}
          {_obj.completed && <DataField _obj={_obj} _fld="initiator_accepted"/>}
          {!_obj.completed && <DataField _obj={_obj} _fld="canceled"/>}
        </FormGroup>

      </FormGroup>,

      <FormGroup row key="adds" className={classes.spaceLeft}>
        <FormGroup className={classes.fullFlex}>
          Прения
        </FormGroup>
        <FormGroup>
          <TabularSection _obj={_obj} _tabular="flows" />
        </FormGroup>
      </FormGroup>

    ]
      :
      <LoadingMessage />;
  }
}

FrmObjIssue.propTypes = {
  _mgr: PropTypes.object,             // DataManager, с которым будет связан компонент
  _acl: PropTypes.string,             // Права на чтение-изменение
  _meta: PropTypes.object,            // Здесь можно переопределить метаданные
  _layout: PropTypes.object,          // Состав и расположение полей, если не задано - рисуем типовую форму

  read_only: PropTypes.object,        // Элемент только для чтения

  handlers: PropTypes.object.isRequired, // обработчики редактирования объекта
};

export default withStyles(withIface(FrmObjIssue));
