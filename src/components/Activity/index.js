import Lazy from 'metadata-react/DumbLoader/Lazy';

export default class Activity extends Lazy {
  componentDidMount() {
    import('./Activity')
      .then((module) => this.setState({Component: module.default}));
  }
}

