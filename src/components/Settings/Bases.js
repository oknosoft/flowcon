import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import NeedAuth from 'metadata-react/App/NeedAuth';
import withStyles from 'metadata-react/styles/paper600';

import BasesTable from './BasesTable';
import BtnsDialog from './BtnsDialog';
import BasesToolbar from './BasesToolbar';
import UsersToolbar from './UsersToolbar';


class Bases extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      base: '',
      user: '',
    };
  }

  toggleBase = (name, value) => {
    return new Promise((resolve) => {
      this.setState({base: value ? name : ''}, resolve);
    });
  };

  toggleUser = (name, value) => {
    return new Promise((resolve) => {
      this.setState({user: value ? name : ''}, resolve);
    });
  };

  render() {
    const {state, props} = this;

    const session = $p.superlogin.getSession();

    if(!session) {
      return <NeedAuth {...props} />;
    }

    const {profile, roles, userDBs} = session;
    const myDBs = (profile.myDBs || [])._clone();
    const myUsers = profile.myUsers || [];
    for(const name in userDBs) {
      name !== 'fl_0_doc' && !myDBs.includes(name) && myDBs.push({name, value: 'Внешняя', disabled: true});
    }

    if(!roles.includes('subscribers') && !roles.includes('doc_full')) {
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

      <Grid key="bases" container direction="row" spacing={24}>
        <Grid item sm={12} md={6}>
          <BasesTable
            title="Общие базы"
            rows={myDBs}
            check
            onToggle={this.toggleBase}
            toolbar={<BasesToolbar
              refresh={() => this.forceUpdate()}
              base={state.base}
              user={state.user}
              myDBs={myDBs.filter((db) => typeof db === 'string')}
              myUsers={myUsers}
            />}
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <BasesTable
            title="Пользователи общих баз"
            rows={myUsers}
            check
            onToggle={this.toggleUser}
            toolbar={<UsersToolbar
              refresh={() => this.forceUpdate()}
              base={state.base}
              user={state.user}
              myDBs={myDBs.filter((db) => typeof db === 'string')}
              myUsers={myUsers}
            />}
          />
        </Grid>
      </Grid>
    ];
  }
}

BtnsDialog.propTypes = {
  classes: PropTypes.object,
  handleNavigate: PropTypes.func,
};

export default withStyles(Bases);
