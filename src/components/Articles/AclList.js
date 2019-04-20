/**
 * Редактор табчасти доступа к документу
 *
 * @module AclList
 *
 * Created by Evgeniy Malyarov on 05.06.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';
import ChipList from 'metadata-react/DataField/ChipList';

class Item {
  constructor(ref) {
    this.ref = ref;
  }
  get name() {
    return this.ref;
  }
}

const suggestions = [
  new Item('_anonymous'),
  new Item('r-subscribers'),
  new Item('r-charts_editor'),
  new Item('r-doc_editor'),
  new Item('r-remote_editor'),
];


class AclList extends React.Component {

  constructor(props, context) {
    super(props, context);

    const {acl} = props._obj;
    this.state = {selectedItems: acl};
  }

  handleChange = ({target}) => {
    this.setState({selectedItems: target.value });
    this.props._obj.acl = target.value;
  };

  render() {
    const { endAdornment } = this.props;
    const { selectedItems } = this.state;

    return (
      <ChipList
        title="Роли доступа"
        items={suggestions}
        selectedItems={selectedItems}
        handleChange={this.handleChange}
        fullWidth
        endAdornment={endAdornment}
      />
    );
  }
}

AclList.propTypes = {
  _obj: PropTypes.object.isRequired,
  endAdornment: PropTypes.node,
};



export default AclList;
