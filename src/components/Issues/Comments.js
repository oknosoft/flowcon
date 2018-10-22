/**
 *
 *
 * @module
 *
 * Created by Evgeniy Malyarov on 21.10.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import CommentEditor from './CommentEditor';


function Comments (props) {
  const {classes, _obj, add_note, del_note} = props;
  const notes = [];
  _obj && _obj.notes.forEach((row) => {
    notes.push(
      <CommentEditor
        key={`n-${row.row}`}
        _obj={row}
        _fld="note"
        caption={`${moment(row.date).format(moment._masks.date_time)} ${row.author.presentation}`}
        classes={classes}
        handleDelete={() => del_note(row)}
      />
    );
  });

  return (
    <div style={{minWidth: 280, marginBottom: 16}}>
      {notes}
      <Button
        variant="fab"
        mini
        title="Добавить комментарий"
        onClick={add_note}
        style={{marginTop: 8}}
      >
        <AddIcon />
      </Button>
    </div>
  );
}

Comments.propTypes = {
  _obj: PropTypes.object,
  classes: PropTypes.object,
  add_note: PropTypes.func,
  del_note: PropTypes.func,
};

export default Comments;
