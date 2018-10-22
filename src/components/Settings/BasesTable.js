import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

export default function BasesTable({title, rows}) {
  return <div>
    <Typography>{title}</Typography>
    <Table>
      <TableBody>
        {rows.map(row => {
          return (
            <TableRow key={row.name}>
              <TableCell>
                {row.name}
              </TableCell>
              <TableCell>
                {row.value}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </div>;
}
