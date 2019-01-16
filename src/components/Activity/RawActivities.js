/**
 * Плоский список видов активности
 *
 * @module RawActivities
 *
 * Created by Evgeniy Malyarov on 14.12.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';

import ActivityRow from './ActivityRow';
import calculate from './calculate';
import register from './register';

class RawActivities extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {busy: false};
    this.select = $p.wsql.alasql.compile('select ref from cat_activity where `use` == true order by sorting_field, name');
    this.calculate = calculate.bind(this);
    this.register = register.bind(this);
  }

  componentDidMount(){
    this.calculate();
  }

  shouldComponentUpdate(nextProps) {
    if(this.props.periodicity !== nextProps.periodicity || this.props.date !== nextProps.date) {
      this.calculate(nextProps.periodicity, nextProps.date);
      return false;
    }
    return true;
  }

  render() {
    const {props: {classes, totals, periodicity, navigate}, state: {busy}} = this;
    const {activity} = $p.cat;

    return [<div key="progress" className={classes.placeholder}>
      <Fade
        in={busy}
        style={{
          transitionDelay: busy ? '300ms' : '0ms',
        }}
        unmountOnExit
      >
        <CircularProgress size={80}/>
      </Fade>
    </div>].concat(
      this.select().map(({ref}, aind) => <ActivityRow
        key={`a-${aind}`}
        classes={classes}
        row={activity.get(ref)}
        totals={totals}
        navigate={navigate}
        periodicity={periodicity}
        register={(activity, minus) => {
          this.register(activity, minus)
            .then(() => this.calculate());
        }}
      />)
    );
  }
}

RawActivities.propTypes = {
  classes: PropTypes.object.isRequired,
  periodicity: PropTypes.string.isRequired,
  totals: PropTypes.object.isRequired,
  date: PropTypes.object.isRequired,
  handleTotals: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default RawActivities;
