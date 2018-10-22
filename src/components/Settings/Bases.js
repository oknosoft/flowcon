import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import NeedAuth from 'metadata-react/App/NeedAuth';
import withStyles from 'metadata-react/styles/paper600';

import BasesToolbar from './BasesToolbar';
import BasesTable from './BasesTable';


class Bases extends React.Component {

  render() {
    const {state, props} = this;

    const session = $p.superlogin.getSession();

    if(!session) {
      return <NeedAuth {...props} />;
    }

    const {profile, roles, userDBs} = session;
    const myDBs = profile.myDBs || [];
    const myUsers = profile.myUsers || [{name: 'noname', value: 'nobase'}];
    const sharedDBs = [];
    for(const name in userDBs) {
      if(name !== 'fl_0_doc') {
        const pos = userDBs[name].lastIndexOf('/') + 1;
        sharedDBs.push({name, value: userDBs[name].substr(pos)});
      }
    }

    if(!roles.includes('r_subscribers') && !roles.includes('doc_full')) {
      return [
        <Helmet key="helmet" title="Общие базы" />,
        <Typography key="title" variant="h6" color="primary" className={props.classes.paddingTop}>Недостаточно прав</Typography>,
        <Typography key="descr">Для управления областями данных, необходимо приобрести </Typography>,
        <Typography
          key="href"
          component="a"
          href="/articles/decent_subscription"
          onClick={(evt) => {
            const url = new URL(evt.target.href);
            evt.preventDefault();
            evt.stopPropagation();
            props.handleNavigate(url.pathname);
          }}
        >Порядочную подписку</Typography>
      ];
    }

    return [
      <Helmet key="helmet" title="Общие базы" />,
      <Typography key="title" variant="h6" color="primary" className={props.classes.paddingTop}>Управление областями и пользователями</Typography>,

      <BasesToolbar key="toolbar"/>,

      <Grid key="bases" container direction="row" spacing={24}>
        <Grid item sm={12} md={6}>
          <BasesTable title="Общие базы" rows={sharedDBs} />
        </Grid>
        <Grid item sm={12} md={6}>
          <BasesTable title="Мои общие базы" rows={sharedDBs} />
        </Grid>
      </Grid>,
      <Grid key="users" container direction="row" spacing={24}>
        <Grid item xs={12}>
          <BasesTable title="Пользователи моих общих баз" rows={myUsers} />
        </Grid>
      </Grid>
    ];
  }
}

export default withStyles(Bases);
