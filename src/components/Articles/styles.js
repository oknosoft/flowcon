import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  flex: {
    flex: 1,
  },
  container: {
    display: 'flex',
  },
  top: {
    marginTop: theme.spacing.unit * 2,
  },
  bottom: {
    marginBottom: theme.spacing.unit * 2,
  },
  details: {
    flexDirection: 'column',
  }
});

export default withStyles(styles);
