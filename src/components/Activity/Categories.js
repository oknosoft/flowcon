/**
 * Категории активностей
 *
 * @module Categories
 *
 * Created by Evgeniy Malyarov on 28.11.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import ActivityRow from './ActivityRow';
import calculate from './calculate';
import register from './register';

class Categories extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.totals = new Map();
    this.categories = 'health,work,family,humanity,personal'.split(',').map((v) => $p.cat.tags_category.predefined(v));
    this.select = $p.wsql.alasql.compile('select ref from cat_activity where `use` == true and `flow` = ? order by sorting_field');
    this.calculate = calculate.bind(this);
  }

  componentDidMount(){
    this.calculate();
  }

  render() {
    const {classes} = this.props;
    const {activity} = $p.cat;

    return this.categories.map((row, cind) => {
      return <ExpansionPanel key={`c-${cind}`}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h3" color="primary" className={classes.width20}>
            {row.name}
          </Typography>
          <Typography color="primary">
            {`(${this.totals.get(row) || 0})`}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails classes={{root: classes.details}}>
          {this.select([row.ref]).map(({ref}, aind) => <ActivityRow
            key={`a-${cind}-${aind}`}
            classes={classes}
            row={activity.get(ref)}
            totals={this.totals}
            register={(activity, minus) => {
              register(activity, minus)
                .then(this.calculate);
            }}
          />)}
        </ExpansionPanelDetails>
      </ExpansionPanel>;
    });
  }
}

Categories.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default Categories;
