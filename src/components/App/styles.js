import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  '@global': {
    html: {
      background: theme.palette.background.default,
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
      boxSizing: 'border-box',
    },
    '*, *:before, *:after': {
      boxSizing: 'inherit',
    },
    body: {
      margin: 0,
    },
  },
  root: {
    //display: 'flex',
    alignItems: 'stretch',
    minHeight: 'calc(100vh - 80px)',
    width: '100%',
  },
  title: {
    marginLeft: theme.spacing.unit,
    flex: '1 1 auto',
    fontSize: '1.1rem',
  },
  appBar: {
    transition: theme.transitions.create('width'),
  },
  appBarHome: {
    boxShadow: 'none',
  },
  appBarShift: {
    [theme.breakpoints.up('lg')]: {
      width: 'calc(100% - 280px)',
    },
  },
  drawer: {
    [theme.breakpoints.up('lg')]: {
      width: 280,
    },
  },
  navIconHide: {
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
});

export default withStyles(styles, {name: 'AppView'});
