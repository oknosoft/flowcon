/**
 * ### Диаграмма
 * обработчики событий и модификаторы данных
 *
 * Created by Evgeniy Malyarov on 16.08.2018
 */

import {connect} from 'react-redux';
import withStyles from './styles';
import compose from 'recompose/compose';

function diagrams() {
  return Promise.resolve([]);
}


function mapStateToProps(state, props) {
  return {
    diagrams
  };
}

// function mapDispatchToProps(dispatch) {
//   return {};
// }

export default compose(
  withStyles,
  connect(mapStateToProps /*, mapDispatchToProps */),
);
