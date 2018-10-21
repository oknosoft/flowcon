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
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  fab: {
    marginTop: theme.spacing.unit,
  },
});


function Comments (props) {
  const {classes, _obj, add_note} = props;
  const notes = [];
  _obj && _obj.notes.forEach((row) => {
    notes.push(
      <CommentEditor
        key={`n-${row.row}`}
        onChange={(val) => {
          row.note = val;
        }}
        value={row.note}
        caption={`${moment(row.date).format(moment._masks.date_time)} ${row.author.presentation}`}
        classes={classes}
      />
    );
  });

  return (
    <div>
      {notes}
      <Button
        variant="fab"
        mini
        className={classes.fab}
        title="Добавить комментарий"
        onClick={add_note}
      >
        <AddIcon />
      </Button>
    </div>
  );
}

export default withStyles(styles, { withTheme: true })(Comments);
