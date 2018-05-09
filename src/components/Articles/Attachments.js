/**
 * Показывает присоединенные к статье файлы, если объект имеет вложения
 *
 * @module Attachments
 *
 * Created by Evgeniy Malyarov on 04.05.2018.
 */

import React from 'react';

import Typography from 'material-ui/Typography';
import AttachmentsToolbar from 'metadata-react/FrmAttachments/AttachmentsToolbar';
import AttachmentsList from 'metadata-react/FrmAttachments/AttachmentsList';

let name = '';
function handleSelect(select){
  name = select;
}

function handleDownload(_obj, handleIfaceState){
  if(name) {
    const url = `${$p.cat.articles.pouch_db.name}/${_obj._id}/${name}`;
    window.open(url, '_blank');
  }
  else {
    handleIfaceState({
      component: '',
      name: 'alert',
      value: {open: true, title: $p.msg.file_download, text: $p.msg.file_select}
    });
  }
}

export default function Attachments({_obj, handleIfaceState}) {
  if(!_obj || !_obj._attachments) {
    return null;
  }
  const download = () => handleDownload(_obj, handleIfaceState);
  return [
    <Typography key="title" variant="title" component="h3" color="primary">Вложенные файлы:</Typography>,
    <AttachmentsToolbar key="toolbar" short handleDownload={download} />,
    <AttachmentsList key="data" _obj={_obj} handleDownload={download} handleSelect={handleSelect} />
  ];
}
