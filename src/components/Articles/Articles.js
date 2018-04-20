/**
 * Список статей
 *
 * @module Articles
 *
 * Created by Evgeniy Malyarov on 17.04.2018.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import AppContent from 'metadata-react/App/AppContent';
import SelectTags from './SelectTags';
import InfiniteArticles from './InfiniteArticles';

const ltitle = 'Статьи';
const title = ltitle + ' о программировании бизнеса';

class Articles extends Component {

  state = {
    tags: [],
  };

  handleChange = event => {
    this.setState({ tags: event.target.value });
  };

  componentDidMount() {
    this.shouldComponentUpdate(this.props);
  }

  shouldComponentUpdate({handleIfaceState, title}) {
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
    const session = $p.superlogin.getSession();
    const {handleNavigate} = this.props;
    return <AppContent >
      <Helmet title={title} />
      <div style={{marginTop: 16}}>
        <Typography variant="display1" component="h1" color="primary">{title}</Typography>
        <SelectTags tags={this.state.tags} handleChange={this.handleChange}/>
        {
          session && session.roles.indexOf('doc_full') !== -1 &&
          <Button color="primary" size="small" onClick={() => handleNavigate('/cat.articles/list')}>Перейти к редактору статей</Button>
        }

        <InfiniteArticles tags={this.state.tags} match={this.props.match} handleNavigate={handleNavigate}/>
      </div>
    </AppContent>;
  }
}

Articles.propTypes = {
  match: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  handleNavigate: PropTypes.func.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
};

export default Articles;
