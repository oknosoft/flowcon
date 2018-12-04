import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  flex: {
    flex: 1,
  },
  container: {
    display: 'flex',
    marginBottom: theme.spacing.unit,
  },
  top: {
    marginTop: theme.spacing.unit * 2,
  },
  ptop: {
    paddingTop: theme.spacing.unit / 2,
  },
  bottom: {
    width: '100%',
  },
  icon: {
    padding: theme.spacing.unit / 2,
  },
  mr16: {
    marginRight: theme.spacing.unit * 2,
  },
  mr48: {
    marginRight: theme.spacing.unit * 6,
  },
  busy: {
    pointerEvents: 'none',
    opacity: 0.5,
  },
  details: {
    flexDirection: 'column',
  },
  placeholder: {
    position: 'absolute',
    height: 80,
    width: 80,
    top: '30vh',
    left: '50%'
  }
});

export default withStyles(styles);
