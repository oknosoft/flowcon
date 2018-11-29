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
  link: {
    display: 'list-item',
    marginLeft: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit / 2,
  },
  details: {
    flexDirection: 'column',
  },
  placeholder: {
    position: 'absolute',
    height: 60,
    top: '30vh',
    left: '50vw'
  }
});

export default withStyles(styles);
