import {createMuiTheme} from 'material-ui/styles';
import teal from 'material-ui/colors/blueGrey';


const theme = createMuiTheme({

  palette: {
    primary: teal, // Purple and green play nicely together.
  },

  mixins: {
    toolbar: {
      minHeight: 48,
    }
  },

  custom: {
    appbar: {
      position: 'fixed',
    }
  },

  // overrides: {
  //   MuiToolbar: {
  //     root: {
  //       minHeight: 48,
  //     },
  //   },
  //   MuiAppBar: {
  //     root: {
  //       backgroundColor: colors.lightBlack,
  //     }
  //   },
  // },

});

export default theme;

