/**
 * Иерархический список (оглавление) статей
 *
 * @module Contents
 *
 * Created by Evgeniy Malyarov on 26.04.2018.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Typography from '@material-ui/core/Typography';

import AppContent from 'metadata-react/App/AppContent';
import withStyles from './styles';
import {description} from '../App/menu';

const ltitle = 'Оглавление';

class Contents extends Component {

  componentDidMount() {
    this.shouldComponentUpdate(this.props);
  }

  shouldComponentUpdate({title, match, handleIfaceState}) {
    if(title != ltitle || match.path !== this.props.match.path) {
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
    const {match, classes} = this.props;
    return <AppContent >
      <Helmet title={ltitle}>
        <meta name="description" content={description} />
        <link rel="canonical" href={match.path + (match.path.endsWith('/') ? '' : '/')} />
        <meta property="og:title" content={ltitle} />
        <meta property="og:description" content={description} />
      </Helmet>
      <div className={classes.top}>
        <Typography variant="display1" component="h1" color="primary">{ltitle}</Typography>

      </div>
    </AppContent>;
  }
}

Contents.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  handleNavigate: PropTypes.func.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
};

export default withStyles(Contents);
