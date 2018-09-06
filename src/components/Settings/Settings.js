import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Helmet from 'react-helmet';
import CnnSettings from 'metadata-react/FrmLogin/CnnSettings';

import withStyles from 'metadata-react/styles/paper600';
import {withIface, withPrm} from 'metadata-redux';

import compose from 'recompose/compose';

class Settings extends Component {

  static propTypes = {
    handleIfaceState: PropTypes.func.isRequired,
    title: PropTypes.string,
  };

  componentDidMount() {
    this.shouldComponentUpdate(this.props);
  }

  shouldComponentUpdate({handleIfaceState, title}) {
    const ltitle = 'Настройки';
    if(title != ltitle) {
      handleIfaceState({
        component: '',
        name: 'title',
        value: ltitle,
      });
      return false;
    }
    return true;
  }

  render() {
    const {props} = this;
    return (
      <Paper className={props.classes.root} elevation={4}>
        <Helmet title={props.title}>
          <meta name="description" content="Параметры подключения" />
          <meta property="og:title" content={props.title} />
          <meta property="og:description" content="Параметры подключения" />
        </Helmet>
        <Typography variant="title" style={{paddingTop: 16}}>Подключение к базе данных</Typography>
        <CnnSettings {...props} disable_settings={location.host === 'business-programming.ru'}/>
      </Paper>
    );
  }
}

export default compose(withStyles, withIface, withPrm)(Settings);
