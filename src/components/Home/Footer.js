// @flow

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styleSheet = theme => ({
  root: {
    overflow: 'auto',
  },
  layout: {
    padding: theme.spacing.unit * 6,
  },
  list: {
    margin: 0,
    paddingLeft: 0,
    listStyle: 'none',
  },
  listItem: {
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: theme.spacing.unit / 2,
  },
});

function AppFooter(props) {
  const {classes, handleNavigate} = props;

  function onClick(evt) {
    const url = new URL(evt.target.href);
    evt.preventDefault();
    evt.stopPropagation();
    handleNavigate(url.pathname);
  }

  return (
    <footer className={classes.root}>
      <div className={classes.layout}>
        <Typography variant="title" gutterBottom>Быстрые ссылки</Typography>
        <Typography variant="subheading" component="div">
          <Grid container spacing={0}>
            <Grid item xs={12} sm={6}>
              <ul className={classes.list}>
                <li className={classes.listItem}>
                  <a href="https://github.com/oknosoft/flowcon">GitHub</a>
                </li>
                <li className={classes.listItem}>
                  <a href="https://github.com/oknosoft/metadata.js">Metadata.js</a>
                </li>
              </ul>
            </Grid>
            <Grid item xs={12} sm={6}>
              <ul className={classes.list}>
                <li className={classes.listItem}>
                  <a href="https://business-programming.ru/news/terms_of_use" onClick={onClick}>Пользовательское соглашение</a>
                </li>
                <li className={classes.listItem}>
                  <a href="https://business-programming.ru/news/privacy_policy" onClick={onClick}>Обработка персональных данных</a>
                </li>
              </ul>
            </Grid>
          </Grid>
        </Typography>
      </div>
    </footer>
  );
}

AppFooter.propTypes = {
  classes: PropTypes.object.isRequired,
  handleNavigate: PropTypes.func.isRequired,
};

export default withStyles(styleSheet)(AppFooter);
