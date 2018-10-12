import Lazy from 'metadata-react/DumbLoader/Lazy';

export default class FrmObjIssue extends Lazy {
  componentDidMount() {
    import('./FrmObjIssue')
      .then((module) => this.setState({Component: module.default}));
  }
}
