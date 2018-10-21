import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import MarkdownInput from '@opuscapita/react-markdown';

function editorStyles(el) {
  const content = el && el.querySelector('.react-markdown--slate-content');
  if(content) {
    content.style.minHeight = '100px';
    const {style} = el.querySelector('.react-markdown--slate-editor');
    style.marginRight = '8px';
  }
}

class CommentEditor extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {edit: Boolean(props.value)};
  }

  toggleEdit = () => {
    this.setState({edit: !this.state.edit});
  }

  render() {

    const {props: {classes, onChange, value, caption}, state: {edit}}  = this;

    return <div ref={editorStyles}>
      <Typography variant="caption" color="textSecondary" className={classes.paddingTop}>{caption}</Typography>
      <MarkdownInput
        onChange={onChange}
        value={value}
        autoFocus={false}
        readOnly={false}
        showFullScreenButton={true}
        hideToolbar
        locale='ru'
      />
    </div>;
  }
}

export default CommentEditor;
