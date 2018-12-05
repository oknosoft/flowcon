import Lazy from 'metadata-react/DumbLoader/Lazy';

export default class FrmObjActivity extends Lazy {
  componentDidMount() {
    import('./FrmObjActivity')
      .then((module) => this.setState({Component: module.default}));
  }
}
