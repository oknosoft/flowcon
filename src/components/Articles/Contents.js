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
import IconButton from '@material-ui/core/IconButton';
import IconBulleted from '@material-ui/icons/FormatListBulleted';

import AppContent from 'metadata-react/App/AppContent';
import SubLink from 'metadata-react/Markdown/SubLink';
import withStyles from './styles';
import cn from 'classnames';
import {description} from '../App/menu';


const ltitle = 'Оглавление';

const sort = (a, b) => a.sorting_field - b.sorting_field;

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
    const keys = [];
    const {cat: {contents}} = $p;
    contents.find_rows({published: true}, (row) => {
      if(!id && row.parent.empty() || row.id === id) {
        rows.push(row);
        keys.push(row.ref);
        row._children().forEach((child) => {
          child.published && keys.push(child.ref);
        });
      }
    });
    if(!rows.length && id) {
      return this.props.handleNavigate('/contents/');
    }
    $p.adapters.pouch.remote.remote.query('contents/contents', {
      keys,
      reduce: true,
      group: true,
    })
      .then((res) => {
        for(const {key, value} of res.rows) {
          contents.get(key).articles = value.map((v) => v.split('π'));
        }
        this.setState({rows});
      })
      .catch(() => {
        this.setState({rows});
      });

    this.id = id;
  }

  navigate(event, page) {
    event.preventDefault();
    event.stopPropagation();
    this.props.handleNavigate(page);
  }

  renderArticles(cnt) {
    const {classes} = this.props;
    return cnt.articles && cnt.articles
      .filter((v) => {
        if(v.includes('_anonymous')) {
          return true;
        }
        const session = $p.superlogin.getSession();
        return session && session.roles.some((role) => {
          return v.includes(role) || v.includes(`r-${role}`);
        });
      })
      .map((v) => <Typography
        key={v[1]}
        component="a"
        variant="subtitle1"
        color="primary"
        href={`/articles/${v[2]}`}
        onClick={(e) => this.navigate(e, `/articles/${v[2]}`)}
        className={classes.link}
      >{v[3]}</Typography>);
  }

  renderSubRows(rows) {
    const {classes} = this.props;
    return rows.map((row, index) => {
      return <div key={`s-${index}`}>
        <Typography variant="h6" component="h3" color="primary" className={classes.subrow}>
          {row.name}
          <SubLink url={`/contents/${row.id}`} onClick={(e) => this.navigate(e, `/contents/${row.id}`)}/>
        </Typography>
        {this.renderArticles(row)}
        </div>;
    });
  }

  renderRows(rows) {
    const {classes} = this.props;
    if(rows.length === 1) {
      const row = rows[0];
      const children = row._children();
      return [
        !row.parent.empty() && <Typography key="h2" variant="h6" component="h2" color="primary">
          {row.parent.name}
          <SubLink url={`/contents/${row.parent.id}`} onClick={(e) => this.navigate(e, `/contents/${row.parent.id}`)}/>
        </Typography>,
        <Typography key="h3" variant="h6" component="h2" color="primary" className={cn({
          [classes.subrow]: !row.parent.empty(),
          [classes.bottom]: row.parent.empty()
        })}>
          {row.name}
          <SubLink url={`/contents/${row.id}`} onClick={(e) => this.navigate(e, `/contents/${row.id}`)}/>
        </Typography>,
        <div key="links">
          {children.length ? this.renderSubRows(children.sort(sort)) : this.renderArticles(row)}
        </div>
      ];
    }
    else {
      const res = [];
      rows.sort(sort).forEach((row, index) => {
        const children = row._children();
        res.push(<ExpansionPanel key={`c-${index}`}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" component="h2" color="primary">
              {row.name}
              <SubLink url={`/contents/${row.id}`} onClick={(e) => this.navigate(e, `/contents/${row.id}`)}/>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails classes={{root: this.props.classes.details}}>
            {children.length ? this.renderSubRows(children.sort(sort)) : this.renderArticles(row)}
          </ExpansionPanelDetails>
        </ExpansionPanel>);
      });
      return res;
    }
  }

  render() {
    const {props: {match, classes}, state: {rows}} = this;

    return <AppContent >
      <Helmet title={ltitle}>
        <meta name="description" content={description} />
        <link rel="canonical" href={match.path + (match.path.endsWith('/') ? '' : '/')} />
        <meta property="og:title" content={ltitle} />
        <meta property="og:description" content={description} />
      </Helmet>
      <div className={classes.top}>
        <div className={classes.container}>
          <Typography variant="h4" component="h1" color="primary" className={classes.bottom}>
            {ltitle}
            <SubLink url="/contents/" onClick={(e) => this.navigate(e, `/contents/`)}/>
          </Typography>
          <IconButton
            onClick={(e) => this.navigate(e, `/articles/`)}
            title="Перейти к списку статей"
          >
            <IconBulleted />
          </IconButton>
        </div>
        {this.renderRows(rows)}
      </div>
    </AppContent>;
  }
}

Contents.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  handleNavigate: PropTypes.func.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
};

export default withStyles(Contents);
