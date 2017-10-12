import React from 'react';

import FrmReport from 'metadata-react/FrmReport';
import RepParams from './RepParams';

// используем типовой отчет, в котором переопределяем закладку параметров
export default function (props) {
  return <FrmReport {...props} RepParams={RepParams} />;
}

