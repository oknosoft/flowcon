// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';

const styleSheet = theme => ({
  root: {
    overflow: 'auto',
  },
  layout: {
    padding: theme.spacing.unit * 6,
  },
  list: {
    margin: 0,
    paddingLeft: 0,
    listStyle: 'none',
  },
  listItem: {
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: theme.spacing.unit / 2,
  },
});

function AppFooter(props) {
  const { classes } = props;

  return (
    <footer className={classes.root}>
      <div className={classes.layout}>
        <Typography type="title" gutterBottom>
          Quick Links
        </Typography>
        <Typography type="subheading" component="div">
          <Grid container spacing={0}>
            <Grid item xs={12} sm={6}>
              <ul className={classes.list}>
                <li className={classes.listItem}>
                  <a href="https://github.com/callemall/material-ui/tree/v1-beta">GitHub</a>
                </li>
                <li className={classes.listItem}>
                  <a href="https://twitter.com/MaterialUI">Twitter</a>
                </li>
                <li className={classes.listItem}>
                  <a href="https://github.com/callemall/material-ui/tree/v1-beta/examples">
                    Examples
                  </a>
                </li>
              </ul>
            </Grid>
            <Grid item xs={12} sm={6}>
              <ul className={classes.list}>
                <li className={classes.listItem}>
                  <a href="/discover-more/community">Community</a>
                </li>
                <li className={classes.listItem}>
                  <a href="/discover-more/roadmap">Roadmap</a>
                </li>
                <li className={classes.listItem}>
                  <a href="/discover-more/team">Team</a>
                </li>
              </ul>
            </Grid>
          </Grid>
        </Typography>
      </div>
    </footer>
  );
}

AppFooter.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(AppFooter);
