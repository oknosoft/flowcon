/**
 * Поле водписки для subscribe.ru
 *
 * @module Subscribe
 *
 * Created by Evgeniy Malyarov on 07.08.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 2,
  }
});

function Subscribe(props) {
  const {title, classes, area} = props;
  return (
    <div className={classes.root}>
      <Typography variant="h6" component="h3" color="primary">Подписаться на рассылку:</Typography>
      <form target="_blank" rel="noopener noreferrer" action="https://subscribe.ru/member/quick" method="get">
        <input type="hidden" name="action" value="quick" />
        <input type="hidden" name="src" value={`list_${area}`} />
        <input type="hidden" name="grp" value={area} />
        <a href={`https://subscribe.ru/catalog/${area}`} target="_blank" rel="noopener noreferrer">{title}</a><br/>
        <input type="text" name="email" size="24" maxLength="100" placeholder="ваш e-mail" />
        <input type="submit" value="Подписаться" />
      </form>
    </div>
  );
}

Subscribe.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  area: PropTypes.string.isRequired,
};

export default withStyles(styles)(Subscribe);
