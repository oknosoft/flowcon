// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Helmet from 'react-helmet';
import AppFooter from './Footer';
import Flask from './Flask';
import styles from './styles';

const ltitle = 'Flowcon: потоки задач';

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

      <div className={classes.hero}>
        <div className={classes.content}>

          <div className={classes.text}>
            <Typography type="display3" component="h1" color="inherit" noWrap>Флакон</Typography>
            <Flask alt="Flowcon Logo" className={classes.logo}/>
            <Typography type="subheading" component="h2" color="inherit" className={classes.headline}>
              Программно-методический комплекс<br/> для управления потоками задач
            </Typography>
            <Button className={classes.button} variant="raised" onClick={() => handleNavigate('/readme')}>Начать</Button>
          </div>
        </div>
      </div>
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
