import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import NeedAuth from 'metadata-react/App/NeedAuth'; // страница "необхлдима авторизация"

import BasesToolbar from './BasesToolbar';

class Bases extends React.Component {

  render() {
    const {state, props} = this;

    const session = $p.superlogin.getSession();

    if(!session) {
      return <NeedAuth {...props} />;
    }

    return [
      <Helmet key="helmet" title="Общие базы">
      </Helmet>,
      <Typography key="title" variant="h6" style={{paddingTop: 16}}>Управление областями и пользователями</Typography>,

      <BasesToolbar key="toolbar"/>,

      <Grid key="bases" container direction="row" spacing={24}>
        <Grid item sm={12} md={6}>
          Общие базы
        </Grid>
        <Grid item sm={12} md={6}>
          Мои общие базы
        </Grid>
      </Grid>,
      <Grid key="users" container direction="row" spacing={24}>
        <Grid item xs={12}>
          Пользователи моих общих баз
        </Grid>
      </Grid>
    ];
  }
}

export default Bases;
