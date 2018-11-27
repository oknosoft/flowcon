import Lazy from 'metadata-react/DumbLoader/Lazy';

export default class FrmObjIssue extends Lazy {
  componentDidMount() {
    import('./Obj/FrmObjIssue')
      .then((module) => this.setState({Component: module.default}));
  }
}
