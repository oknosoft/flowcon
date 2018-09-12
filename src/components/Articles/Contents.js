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
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AppContent from 'metadata-react/App/AppContent';
import withStyles from './styles';
import {description} from '../App/menu';

const ltitle = 'Оглавление';

class Contents extends Component {

  state = {rows: []};

  componentDidMount() {
    this.shouldComponentUpdate(this.props);
  }

  shouldComponentUpdate({title, match, location, handleIfaceState}) {
    let needUpdate = true;
    const id = location.pathname.replace(match.path, '').replace(/^\/|\/$/g, '');
    if(title != ltitle) {
      handleIfaceState({
        component: '',
        name: 'title',
        value: ltitle,
      });
      needUpdate = false;
    }
    if(this.id !== id) {
      this.readContents(id);
      needUpdate = false;
    }
    return needUpdate;
  }

  readContents(id) {
    const rows = [];
    $p.cat.contents.find_rows({published: true}, (row) => {
      if(!id && row.parent.empty() || row.id === id) {
        rows.push(row);
      }
    });
    this.setState({rows});
    this.id = id;
  }

  renderArticles(cnt) {
    return <div>статья</div>;
  }

  renderSubRows(rows) {
    return rows.map((row, index) => {
      return <div key={`s-${index}`}>
        <Typography variant="subheading" component="h3" color="primary">{row.name}</Typography>
        {this.renderArticles(row)}
        </div>;
    });
  }

  renderRows(rows) {
    const res = [];
    const sort = (a, b) => a.sorting_field - b.sorting_field;
    rows.sort(sort).forEach((row, index) => {
      const children = row._children();
      res.push(<ExpansionPanel key={`c-${index}`}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="title" component="h2" color="primary">{row.name}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails classes={{root: this.props.classes.details}}>
          {children.length ? this.renderSubRows(children.sort(sort)) : this.renderArticles(row)}
        </ExpansionPanelDetails>
      </ExpansionPanel>);
    })
    return res;
  }

  render() {
    const {props: {match, location, classes}, state: {rows}} = this;

    return <AppContent >
      <Helmet title={ltitle}>
        <meta name="description" content={description} />
        <link rel="canonical" href={match.path + (match.path.endsWith('/') ? '' : '/')} />
        <meta property="og:title" content={ltitle} />
        <meta property="og:description" content={description} />
      </Helmet>
      <div className={classes.top}>
        <Typography variant="display1" component="h1" color="primary" className={classes.bottom}>{ltitle}</Typography>
        {this.renderRows(rows)}
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
