import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

class BasesTable extends React.Component {

  state = {checked: null};

  handleToggle = index => () => {
    const {props: {onToggle, rows, multi}, state: {checked}}  = this;
    (onToggle ? onToggle(rows[index], checked !== index) : Promise.resolve())
      .then(() => !multi && this.setState({checked: checked === index ? null : index}));
  };

  render() {
    const {title, rows, check} = this.props;

    return <div>
      <Typography>{title}</Typography>
      <List>
        {rows.map((value, index) => (
          <ListItem
            key={`i-${index}`}

            button
            onClick={this.handleToggle(index)}
            disabled={value.disabled}
          >

            {
              check && <Checkbox
                checked={value.checked || this.state.checked === index}
                tabIndex={-1}
                disableRipple
              />
            }

            {typeof value === 'string' && <ListItemText primary={value} />}

            {typeof value === 'object' && <ListItemText
              primary={value.name}
              secondary={Array.isArray(value.value) ? value.value.join(', ') : value.value}
            />}

          </ListItem>
        ))}
      </List>
    </div>;
  }
}

export default BasesTable;
