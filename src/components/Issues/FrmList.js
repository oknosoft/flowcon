import Lazy from 'metadata-react/DumbLoader/Lazy';

export default class FrmIssueList extends Lazy {
  componentDidMount() {
    import('./FrmIssueList')
      .then((module) => this.setState({Component: module.default}));
  }
}
