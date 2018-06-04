/**
 * Строка в списке статей
 * @module ArticleRow
 *
 * Created by Evgeniy Malyarov on 18.04.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import Chip from '@material-ui/core/Chip';
import cn from 'classnames';


export default function ArticleRow(props) {
  // , author, tags
  const {row: {id, name, h1, introduction, date, author, tags}, match, handleNavigate, classes, news} = props;
  const intro = introduction || h1;
  const {utils, cat} = $p;
  const href = id ? `${match.url}${match.url.endsWith('/') ? '' : '/'}${id}` : '#';
  const onClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    handleNavigate(href);
  };

  return (
    <FormGroup classes={{root: cn(classes.nowrap, classes.bottom)}}>
      <Typography
        variant={news ? "body2" : "title"}
        component="a"
        href={href}
        onClick={onClick}
        color="primary"
      >
        {name}
      </Typography>
      {
        !news && <FormGroup row onClick={onClick} classes={{root: classes.nowrap}}>
          <Typography variant="caption" className={classes.flex}>{utils.moment(date).format('ll')}</Typography>
          <Typography variant="caption" title="Автор" className={classes.author}>{`@${cat.users.get(author).id}`}</Typography>
        </FormGroup>
      }
      {
        !news && <FormGroup row onClick={onClick}>
          {
            tags && tags.map((tag, index) => <Chip key={index} label={cat.tags.get(tag).name} className={classes.chip} />)
          }
        </FormGroup>
      }
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
  news: PropTypes.bool,
};
