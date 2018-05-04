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
import withStyles from 'metadata-react/DataField/styles';

class SelectTags extends React.Component {

  render() {
    const {classes, tags, handleChange, tagList, ...other} = this.props;

    return (
      <FormControl className={classes.formControl} margin="dense" {...other}>
        <InputLabel>Разделы</InputLabel>
        <Select
          multiple
          value={tags}
          onChange={handleChange}
          input={<Input />}
          renderValue={selected => selected.map(v => $p.cat.tags.get(v).name).join(', ')}
        >
          {tagList.map((tag) => (
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
  classes: PropTypes.object.isRequired,
  tags: PropTypes.array.isRequired,
  tagList: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default withStyles(SelectTags);
