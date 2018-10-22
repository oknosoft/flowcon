import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Helmet from 'react-helmet';
import CnnSettings from 'metadata-react/FrmLogin/CnnSettings';

import withStyles from 'metadata-react/styles/paper600';
import {withIface, withPrm} from 'metadata-redux';

import compose from 'recompose/compose';

class Cnn extends Component {

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
    return [
      <Helmet key="helmet" title={props.title}>
        <meta name="description" content="Параметры подключения" />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content="Параметры подключения" />
      </Helmet>,
      <Typography key="title" variant="h6" style={{paddingTop: 16}}>Подключение к базе данных</Typography>,
      <CnnSettings key="settings" {...props} disable_settings={location.host === 'business-programming.ru'}/>
    ];
  }
}

export default compose(withStyles, withIface, withPrm)(Cnn);
