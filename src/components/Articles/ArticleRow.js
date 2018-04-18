/**
 * Строка в списке статей
 * @module ArticleRow
 *
 * Created by Evgeniy Malyarov on 18.04.2018.
 */

import React from 'react';
import Typography from 'material-ui/Typography';
import {FormGroup} from 'material-ui/Form';


export default function ArticleRow(props) {
  const {row: {_id, id, name, h1, introduction, date, author, tags}, match, handleNavigate, classes} = props;
  const intro = introduction || h1;
  return (
    <FormGroup classes={{root: classes.nowrap}}>
      <Typography
        variant="title"
        component="a"
        href={`${match.url}/${id}`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          handleNavigate(`${match.url}${match.url.endsWith('/') ? '' : '/'}${id}`);
        }}
        color="primary"
      >
        {name}
      </Typography>
      <Typography variant="caption">{$p.utils.moment(date).format('ll')}</Typography>
      {
        intro !== name && <Typography component="p" color="primary">{intro}</Typography>
      }
    </FormGroup>
  );
};
