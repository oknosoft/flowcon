/**
 *
 *
 * @module SelectTags
 *
 * Created by Evgeniy Malyarov on 17.04.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import { ListItemText } from 'material-ui/List';
import Select from 'material-ui/Select';
import Checkbox from 'material-ui/Checkbox';


class SelectTags extends React.Component {


  render() {
    const {tags, handleChange} = this.props;
    const {alatable} = $p.cat.tags;

    return (
      <FormControl fullWidth>
        <InputLabel>Разделы</InputLabel>
        <Select
          multiple
          value={tags}
          onChange={handleChange}
          input={<Input />}
          renderValue={selected => selected.map(v => $p.cat.tags.get(v).name).join(', ')}
        >
          {alatable.map(tag => (
            <MenuItem key={tag.ref} value={tag.ref}>
              <Checkbox checked={tags.indexOf(tag.ref) > -1} />
              <ListItemText primary={tag.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

SelectTags.propTypes = {
  tags: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default SelectTags;
