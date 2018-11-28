/**
 * События активности
 *
 * @module Activity
 *
 * Created by Evgeniy Malyarov on 18.09.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import IconSettings from '@material-ui/icons/Settings';
import AppContent from 'metadata-react/App/AppContent';
import DumbScreen from '../DumbScreen';

import Categories from './Categories';
import withStyles from '../Articles/styles';

const ltitle = 'Активность';
const description = 'Регистрация активностей';

class Activity extends React.Component {

  componentDidMount() {
    this.shouldComponentUpdate(this.props);
  }

  shouldComponentUpdate({title, handleIfaceState}) {
    let needUpdate = true;
    if(title != ltitle) {
      handleIfaceState({
        component: '',
        name: 'title',
        value: ltitle,
      });
      needUpdate = false;
    }
    return needUpdate;
  }

  navigate(event, page) {
    event.preventDefault();
    event.stopPropagation();
    this.props.handleNavigate(page);
  }

  render() {
    const {props: {match, classes, doc_ram_loaded}} = this;

    if(!doc_ram_loaded) {
      return <DumbScreen
        title="Загрузка из IndexedDB..."
        page={{text: 'Получение данных...'}}
      />;
    }

    return <AppContent >
      <Helmet title={ltitle}>
        <meta name="description" content={description} />
        <link rel="canonical" href={match.path} />
        <meta property="og:title" content={ltitle} />
        <meta property="og:description" content={description} />
      </Helmet>
      <div className={classes.top}>
        <div className={classes.container}>
          <Typography variant="h4" component="h1" color="primary" className={classes.bottom}>
            {ltitle}
          </Typography>
          <IconButton
            onClick={(e) => this.navigate(e, `/cat.activity/list`)}
            title="Настройка состава активностей"
          >
            <IconSettings />
          </IconButton>
        </div>
        <Categories classes={classes}/>
      </div>
    </AppContent>;
  }
}

Activity.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  handleNavigate: PropTypes.func.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
};

export default withStyles(Activity);
