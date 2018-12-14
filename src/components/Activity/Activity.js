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
import IconHelp from '@material-ui/icons/HelpOutline';

import AppContent from 'metadata-react/App/AppContent';
import DumbScreen from '../DumbScreen';
import Categories from './Categories';
import RawActivities from './RawActivities';
import Periodicity from './Periodicity';
import Settings from './Settings';
import Diagrams from './Diagrams';
import withStyles from './styles';

const ltitle = 'Активность';
const description = 'Регистрация активностей';

class Activity extends React.Component {

  constructor(props, context) {
    super(props, context);
    let grouping = $p.wsql.get_user_param('activities_grouping');
    if(typeof grouping === 'string') {
      grouping = Boolean(grouping);
    }
    else{
      grouping = true;
    }
    this.state = {
      periodicity: 'today',
      grouping,
      date: new Date(),
      totals: new Map(),
    };
  }

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

  navigate = (event, page) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.handleNavigate(page);
  }

  handlePeriodicity = (periodicity, date) => {
    this.setState({periodicity, date});
  };

  handleGrouping = () => {
    const grouping = !this.state.grouping;
    this.setState({grouping});
    $p.wsql.set_user_param('activities_grouping', grouping);
  };

  handleTotals = (totals) => {
    this.setState({totals});
  };

  render() {
    const {props: {match, classes, doc_ram_loaded}, state: {periodicity, date, totals, grouping}} = this;

    if(!doc_ram_loaded) {
      return <DumbScreen
        title="Загрузка из IndexedDB..."
        page={{text: 'Получение данных...'}}
      />;
    }

    const Activities = grouping ? Categories : RawActivities;

    return <AppContent >
      <Helmet title={ltitle}>
        <meta name="description" content={description} />
        <link rel="canonical" href={match.path} />
        <meta property="og:title" content={ltitle} />
        <meta property="og:description" content={description} />
      </Helmet>
      <div className={classes.top}>
        <div className={classes.container}>
          <Typography variant="h5" component="h1" color="primary" className={classes.bottom}>
            {ltitle}
          </Typography>
          <Periodicity
            periodicity={periodicity}
            date={date}
            handlePeriodicity={this.handlePeriodicity}
            classes={classes}
          />
          <Settings
            navigate={this.navigate}
            handleGrouping={this.handleGrouping}
            grouping={grouping}
          />
          <IconButton
            onClick={(e) => this.navigate(e, `/articles/activity`)}
            title="Справка"
          >
            <IconHelp />
          </IconButton>
        </div>
        <Activities
          classes={classes}
          periodicity={periodicity}
          date={date}
          totals={totals}
          handleTotals={this.handleTotals}
          navigate={this.navigate}
        />
      </div>
      <Diagrams totals={totals} periodicity={periodicity} date={date}/>
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
  doc_ram_loaded: PropTypes.bool,
};

export default withStyles(Activity);
