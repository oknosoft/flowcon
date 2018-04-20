// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Typography from 'material-ui/Typography';
//import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Helmet from 'react-helmet';
import AppFooter from './Footer';
import Flask from './Flask';
//import EventNote from '@material-ui/icons/EventNote';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import Check from '@material-ui/icons/Check';
import Timer from '@material-ui/icons/Timer';

import styles from './styles';

const ltitle = 'business-programming';

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
      <Helmet title={ltitle}/>

      <Grid container spacing={24} className={classes.hero}>
        <Grid item sm={12} lg={6}>
          <div className={classes.content}>
            <div className={classes.text} onClick={() => handleNavigate('/articles')}>
              <Typography variant="headline" component="h2" color="inherit">Статьи</Typography>
              <LibraryBooks alt="Статьи" className={classes.logo}/>
              <Typography variant="subheading" component="h3" color="inherit" className={classes.headline}>
                Программирование бизнеса
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid item sm={12} lg={6}>
          <div className={classes.content}>
            <div className={classes.text} onClick={() => handleNavigate('/articles/flowcon-readme')}>
              <Typography variant="headline" component="h2" color="inherit">Flowcon</Typography>
              <Flask alt="Flowcon Logo" className={classes.logo}/>
              <Typography variant="subheading" component="h3" color="inherit" className={classes.headline}>
                Программно-методический комплекс<br/> для управления потоками задач
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid item sm={12} lg={6}>
          <div className={classes.content}>
            <div className={classes.text} onClick={() => handleNavigate('/check')}>
              <Typography variant="headline" component="h2" color="inherit">Проверка данных</Typography>
              <Check alt="Проверка данных" className={classes.logo}/>
              <Typography variant="subheading" component="h3" color="inherit" className={classes.headline}>
                Библиотека алгоритмов
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid item sm={12} lg={6}>
          <div className={classes.content}>
            <div className={classes.text} onClick={() => handleNavigate('/planing')}>
              <Typography variant="headline" component="h2" color="inherit">Планирование ресурсов</Typography>
              <Timer alt="Планирование" className={classes.logo}/>
              <Typography variant="subheading" component="h3" color="inherit" className={classes.headline}>
                Простое решение
              </Typography>
            </div>
          </div>
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
