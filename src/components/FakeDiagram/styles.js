/**
 * ### Диаграмма
 * стили оформления
 *
 * Created by Evgeniy Malyarov on 16.08.2018
 */

import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  paper: {
    minWidth: 880,
    maxHeight: 'calc(100vh - 80px)',
  },
  secondary: {
    marginTop: -theme.spacing.unit * 1.5,
  }
});

export default withStyles(styles);
