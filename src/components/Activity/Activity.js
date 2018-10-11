/**
 * События активности
 *
 * @module Activity
 *
 * Created by Evgeniy Malyarov on 18.09.2018.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import IconSettings from '@material-ui/icons/Settings';

import AppContent from 'metadata-react/App/AppContent';
import withStyles from '../Articles/styles';
import cn from 'classnames';
import {item_props} from '../App/menu';
import SubLink from 'metadata-react/Markdown/SubLink';

const ltitle = 'Активность';
const description = 'Регистрация активностей';

class Activity extends Component {

  constructor(props, context) {
    super(props, context);
    this._select = $p.wsql.alasql.compile('select ref from cat_activity where `use` == true order by sorting_field');
  }

  componentDidMount() {
    this.shouldComponentUpdate(this.props);
  }

  shouldComponentUpdate({title, match, location, handleIfaceState}) {
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

  renderRows() {
    const {activity} = $p.cat;
    return this._select().map(({ref}, index) => {
      const row = activity.get(ref);
      return <ExpansionPanel key={`c-${index}`}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2" color="primary">
            {row.name}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails classes={{root: this.props.classes.details}}>
          {'detales'}
        </ExpansionPanelDetails>
      </ExpansionPanel>;
    });
  }

  render() {
    const {props: {match, classes}} = this;

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
        {this.renderRows()}
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
