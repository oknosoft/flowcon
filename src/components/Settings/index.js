import Lazy from 'metadata-react/DumbLoader/Lazy';

export default class Settings extends Lazy {
  componentDidMount() {
    import('./Settings')
      .then((module) => this.setState({Component: module.default}));
  }
}

