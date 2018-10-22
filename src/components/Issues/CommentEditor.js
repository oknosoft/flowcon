import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import MarkdownInput from '@opuscapita/react-markdown';
import MarkdownElement from 'metadata-react/Markdown/MarkdownElement';
import CommentMenu from './CommentMenu';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';


const styles = theme => ({
  mdCont: {
    border: '1px solid rgba(0, 0, 0, 0.1)',
    margin: '0 8px 0 0',
    padding: '0 4px',
    minHeight: 80,
    '& p, & ul': {
      marginTop: theme.spacing.unit / 2,
      marginBottom: theme.spacing.unit / 2,
    }
  },
  smallIcon: {
    fontSize: 18,
  },
  button: {
    padding: theme.spacing.unit,
  }
});

function editorStyles(el) {
  const content = el && el.querySelector('.react-markdown--slate-content');
  if(content) {
    content.style.minHeight = '80px';
    const {style} = el.querySelector('.react-markdown--slate-editor');
    style.marginRight = '8px';
  }
}

const Inner = withStyles(styles)(({classes, pclasses, onChange, value, caption, edit, toggleEdit, handleDelete}) => {
  return [
    <div key="caption" className={pclasses.row}>
      <Typography variant="caption" color="textSecondary" className={cn(pclasses.paddingTop, pclasses.fullFlex)}>{caption}</Typography>
      <CommentMenu
        classes={{
          button: cn(pclasses.marginRight, classes.button),
          icon: classes.smallIcon
        }}
        toggleEdit={toggleEdit}
        handleDelete={handleDelete}
      />
    </div>,
    edit ?
      <div key="input" ref={editorStyles}>
        <MarkdownInput
          onChange={onChange}
          value={value}
          autoFocus={false}
          readOnly={false}
          showFullScreenButton={true}
          hideToolbar
          locale='ru'
        />
      </div>
      :
      <MarkdownElement
        key="input"
        //classes={{[classes.mdCont]: classes.mdCont}}
        className={classes.mdCont}
        text={value}
        mdtitle={caption}
      />
    ];
});

class CommentEditor extends React.Component {

  constructor(props, context) {
    super(props, context);
    const {_obj, _fld}  = this.props;
    this.state = {edit: !_obj[_fld]};
  }

  toggleEdit = () => {
    this.setState({edit: !this.state.edit});
  }

  handleChange=(val) => {
    const {_obj, _fld} = this.props;
    _obj[_fld] = val;
  };

  render() {
    const {props: {classes, _obj, _fld, caption, handleDelete}, state: {edit}}  = this;
    return <Inner
      pclasses={classes}
      onChange={this.handleChange}
      value={_obj[_fld]}
      caption={caption}
      edit={edit}
      toggleEdit={this.toggleEdit}
      handleDelete={handleDelete}
    />;

  }
}

CommentEditor.propTypes = {
  _obj: PropTypes.object,
  _fld: PropTypes.string,
  caption: PropTypes.string,
  classes: PropTypes.object,
  handleDelete: PropTypes.func,
};

export default CommentEditor;
