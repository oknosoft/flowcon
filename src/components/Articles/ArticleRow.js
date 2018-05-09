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
import Chip from 'material-ui/Chip';
import cn from 'classnames';


export default function ArticleRow(props) {
  // , author, tags
  const {row: {id, name, h1, introduction, date, author, tags}, match, handleNavigate, classes} = props;
  const intro = introduction || h1;
  const {utils, cat} = $p;
  const onClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    handleNavigate(id ? `${match.url}${match.url.endsWith('/') ? '' : '/'}${id}` : '#');
  };

  return (
    <FormGroup classes={{root: cn(classes.nowrap, classes.bottom)}}>
      <Typography
        variant="title"
        component="a"
        href={id ? `${match.url}/${id}` : '#'}
        onClick={onClick}
        color="primary"
      >
        {name}
      </Typography>
      <FormGroup row onClick={onClick} classes={{root: classes.nowrap}}>
        <Typography variant="caption" className={classes.flex}>{utils.moment(date).format('ll')}</Typography>
        <Typography variant="caption" title="Автор" className={classes.author}>{`@${cat.users.get(author).id}`}</Typography>
      </FormGroup>
      <FormGroup row onClick={onClick}>
        {
          tags && tags.map((tag, index) => <Chip key={index} label={cat.tags.get(tag).name} className={classes.chip} />)
        }
      </FormGroup>
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
