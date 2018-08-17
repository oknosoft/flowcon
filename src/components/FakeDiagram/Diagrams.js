/**
 * ### Комплект диаграмм
 * Получает настройки из профиля пользователя и выводит пачку
 *
 * @module Diagrams
 *
 * Created by Evgeniy Malyarov on 16.08.2018.
 */

import React from 'react';
import Helmet from 'react-helmet';
import CircularProgress from '@material-ui/core/CircularProgress';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import AppContent from 'metadata-react/App/AppContent';
import Snack from 'metadata-react/App/Snack';
import Diagram from './Diagram';
import connect from './connect';
import PropTypes from 'prop-types';

const ltitle = 'Диаграммы';


function DiagramsArray({width, classes, diagrams}) {
  return diagrams.length ?
    diagrams.map((data, key) => <Diagram key={key} width={width} data={data} classes={classes}/>)
    :
    <div><CircularProgress size={24} /> Загрузка...</div>;
}

class Diagrams extends React.Component {

  state = {diagrams: [], snack: false, reseted: false};

  componentDidMount() {
    this.shouldComponentUpdate(this.props);
    setTimeout(() => this.setDiagrams(), 400);
  }

  setDiagrams() {
    const {props} = this;
    if(this.logged_in === props.user.logged_in) {
      return;
    }
    this.logged_in = props.user.logged_in;
    props.diagrams()
      .then(diagrams => this.setState({diagrams}));
  }

  shouldComponentUpdate({handleIfaceState, title, user, snack}) {
    if(title != ltitle) {
      handleIfaceState({
        component: '',
        name: 'title',
        value: ltitle,
      });
      return false;
    }
    if(user.logged_in) {
      if(snack && snack.open) {
        this.componentWillUnmount();
        this.setDiagrams();
      }
    }
    else if(!this.state.reseted && !this.state.snack) {
      this.setState({snack: true});
      return false;
    }
    return true;
  }

  render() {
    const {props: {classes}, state: {diagrams, snack}}  = this;
    return <AppContent>
      <Helmet title={ltitle}>
        <meta name="description" content="Комплект диаграмм" />
      </Helmet>
      {
        snack && <Snack
          snack={{open: true, message: 'Пользователь не авторизован - демо режим', button: 'Закрыть'}}
          handleClose={() => this.setState({snack: false, reseted: true})}
        />
      }
      <AutoSizer disableHeight style={{overflow: 'hidden', width: '100%'}}>
        {({width}) => <DiagramsArray width={width} classes={classes} diagrams={diagrams}/>}
      </AutoSizer>
    </AppContent>;
  }
}

DiagramsArray.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  diagrams: PropTypes.array.isRequired,
};

Diagrams.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
  diagrams: PropTypes.func.isRequired,
  snack: PropTypes.object,
  user: PropTypes.object,
};

export default connect(Diagrams);
