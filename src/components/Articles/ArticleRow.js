/**
 * Строка в списке статей
 * @module ArticleRow
 *
 * Created by Evgeniy Malyarov on 18.04.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import {FormGroup} from 'material-ui/Form';


export default function ArticleRow(props) {
  // , author, tags
  const {row: {id, name, h1, introduction, date}, match, handleNavigate, classes} = props;
  const intro = introduction || h1;
  return (
    <FormGroup classes={{root: classes.nowrap}}>
      <Typography
        variant="title"
        component="a"
        href={id ? `${match.url}/${id}` : '#'}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          handleNavigate(id ? `${match.url}${match.url.endsWith('/') ? '' : '/'}${id}` : '#');
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
}

ArticleRow.propTypes = {
  match: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  handleNavigate: PropTypes.func.isRequired,
  row: PropTypes.object.isRequired,
};
