/**
 * ### Диаграмма
 * стили оформления
 *
 * Created by Evgeniy Malyarov on 16.08.2018
 */

import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  flex: {
    flex: 1,
    whiteSpace: 'nowrap',
  },
  container: {
    display: 'flex',
  },
  secondary: {
    marginTop: -theme.spacing.unit * 1.5,
  }
});

export default withStyles(styles);
