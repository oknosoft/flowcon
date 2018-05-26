// @flow

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Helmet from 'react-helmet';
import AppFooter from './Footer';
import Flask from './Flask';
//import EventNote from '@material-ui/icons/EventNote';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import Check from '@material-ui/icons/Check';
import Timer from '@material-ui/icons/Timer';

import {description} from '../App/menu';

import styles from './styles';

const ltitle = 'Программирование бизнеса';

function PageHome(props) {
  const {classes, handleNavigate, title} = props;

  if(title != ltitle) {
    props.handleIfaceState({
      component: '',
      name: 'title',
      value: ltitle,
    });
  }

  return (
    <div className={classes.root}>
      <Helmet title={ltitle}>
        <meta name="description" content={description} />
      </Helmet>

      <Grid container spacing={8} className={classes.hero}>
        <Grid item sm={12} lg={6}>
          <Grid container spacing={16} wrap="nowrap" onClick={() => handleNavigate('/articles/')}>
            <Hidden lgDown><Grid item xs={1}/></Hidden>
            <Grid item>
              <LibraryBooks alt="Статьи" className={classes.logo} color="disabled"/>
            </Grid>
            <Grid item className={classes.content}>
              <Typography variant="headline" component="h2">Статьи</Typography>
              <Typography color="textSecondary">
                Методические материалы, кейсы и технический блог
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item sm={12} lg={6}>
          <Grid container spacing={16} wrap="nowrap" onClick={() => handleNavigate('/articles/flowcon-readme')}>
            <Hidden lgDown><Grid item xs={1}/></Hidden>
            <Grid item>
              <Flask alt="Flowcon Logo" className={classes.logo} color="disabled"/>
            </Grid>
            <Grid item className={classes.content}>
              <Typography variant="headline" component="h2">Flowcon</Typography>
              <Typography color="textSecondary">
                Программно-методический комплекс для управления потоками задач
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item sm={12} lg={6}>
          <Grid container spacing={16} wrap="nowrap" onClick={() => handleNavigate('/articles/check_data')}>
            <Hidden lgDown><Grid item xs={1}/></Hidden>
            <Grid item>
              <Check alt="Проверка данных" className={classes.logo} color="disabled"/>
            </Grid>
            <Grid item className={classes.content}>
              <Typography variant="headline" component="h2">Проверка данных</Typography>
              <Typography color="textSecondary">
                Библиотека алгоритмов
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item sm={12} lg={6}>
          <Grid container spacing={16} wrap="nowrap" onClick={() => handleNavigate('/planing/')}>
            <Hidden lgDown><Grid item xs={1}/></Hidden>
            <Grid item>
              <Timer alt="Планирование" className={classes.logo} color="disabled"/>
            </Grid>
            <Grid item className={classes.content}>
              <Typography variant="headline" component="h2">Планирование ресурсов</Typography>
              <Typography color="textSecondary">
                Простое решение сложной проблемы
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>


      <AppFooter/>
    </div>
  );
}

PageHome.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  handleNavigate: PropTypes.func.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
};

export default withStyles(styles)(PageHome);
