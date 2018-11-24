/**
 * ### Комплект диаграмм
 * Получает настройки из профиля пользователя и выводит пачку
 *
 * @module Diagrams
 *
 * Created by Evgeniy Malyarov on 16.08.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import AppContent from 'metadata-react/App/AppContent';
import DiagramsArray from 'metadata-react/Diagrams/DiagramsArray';
import withStyles from 'metadata-react/Diagrams/styles';
import {withIface} from 'metadata-redux';

const ltitle = 'Исполнение задач';
const descr = 'Диаграммы исполнения задач';

class ExecutionDiagrams extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      diagrams: [],
      grid: '3',
      reseted: false,
    };
    this.onChange = this.setDiagrams.bind(this, true);
  }

  componentDidMount() {
    this.shouldComponentUpdate(this.props);
    setTimeout(() => this.setDiagrams(), 400);
  }

  setDiagrams() {
    const diagrams = [
      {
        "title": "7 дней",
        "description": "Сколько задач мы решили за неделю",
        "kind": "line",
        "hideLegend": false,
        "acl": [
          "_anonymous"
        ],
        "points": [
          {
            "name": "ПредставлениеДаты",
            "presentation": "ПредставлениеДаты"
          }
        ],
        "series": [
          {
            "name": "Белокаменцев И.Е.",
            "presentation": "Белокаменцев И.Е.",
            "color": "#FF0000",
            "opacity": 1
          },
          {
            "name": "Маляров Е.С.",
            "presentation": "Маляров Е.С.",
            "color": "#624FAC",
            "opacity": 1
          },
          {
            "name": "",
            "presentation": "",
            "color": "#D02A35",
            "opacity": 1
          }
        ],
        "rows": [
          {
            "Маляров Е.С.": {
              "value": 23,
              "presentation": "23",
              "color": "#000000"
            },
            "Белокаменцев И.Е.": {
              "value": 27,
              "presentation": "27",
              "color": "#000000"
            },
            "ПредставлениеДаты": "16.11.2018"
          },
          {
            "Маляров Е.С.": {
              "value": 13,
              "presentation": "13",
              "color": "#000000"
            },
            "Белокаменцев И.Е.": {
              "value": 0,
              "presentation": "",
              "color": "#000000"
            },
            "ПредставлениеДаты": "17.11.2018"
          },
          {
            "Маляров Е.С.": {
              "value": 30,
              "presentation": "30",
              "color": "#000000"
            },
            "Белокаменцев И.Е.": {
              "value": 53,
              "presentation": "53",
              "color": "#000000"
            },
            "ПредставлениеДаты": "19.11.2018"
          },
          {
            "Маляров Е.С.": {
              "value": 29,
              "presentation": "29",
              "color": "#000000"
            },
            "Белокаменцев И.Е.": {
              "value": 52,
              "presentation": "52",
              "color": "#000000"
            },
            "ПредставлениеДаты": "20.11.2018"
          },
          {
            "Маляров Е.С.": {
              "value": 42,
              "presentation": "42",
              "color": "#000000"
            },
            "Белокаменцев И.Е.": {
              "value": 25,
              "presentation": "25",
              "color": "#000000"
            },
            "ПредставлениеДаты": "21.11.2018"
          },
          {
            "Маляров Е.С.": {
              "value": 3,
              "presentation": "3",
              "color": "#000000"
            },
            "Белокаменцев И.Е.": {
              "value": 42,
              "presentation": "42",
              "color": "#000000"
            },
            "ПредставлениеДаты": "22.11.2018"
          },
          {
            "Маляров Е.С.": {
              "value": 5,
              "presentation": "5",
              "color": "#000000"
            },
            "Белокаменцев И.Е.": {
              "value": 5,
              "presentation": "5",
              "color": "#000000"
            },
            "ПредставлениеДаты": "23.11.2018"
          },
          {
            "": {
              "value": 0,
              "presentation": "",
              "color": "#000000"
            },
            "ПредставлениеДаты": ""
          }
        ]
      }
    ];
    this.setState({diagrams});
  }

  shouldComponentUpdate({handleIfaceState, title, user}) {

    if(title != ltitle) {
      handleIfaceState({
        component: '',
        name: 'title',
        value: ltitle,
      });
      return false;
    }
    return true;
  }

  render() {
    const {props: {classes}, state: {diagrams, grid}}  = this;

    return <AppContent fullWidth>
      <Helmet title={ltitle}>
        <meta name="description" content={descr} />
        <meta property="og:title" content={ltitle} />
        <meta property="og:description" content={descr} />
      </Helmet>
      <AutoSizer disableHeight style={{overflow: 'hidden', width: '100%', paddingBottom: 48}}>
        {({width}) => <DiagramsArray
          width={width}
          classes={classes}
          diagrams={diagrams}
          grid={grid}
        />}
      </AutoSizer>
    </AppContent>;
  }
}

ExecutionDiagrams.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default withIface(withStyles(ExecutionDiagrams));
