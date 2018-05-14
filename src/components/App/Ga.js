/**
 * Global site tag (gtag.js) - Google Analytics
 *
 * @module Ga
 *
 * Created by Evgeniy Malyarov on 14.05.2018.
 */

import React from 'react';
import Helmet from 'react-helmet';

export default function ({id, host}) {
  // UA-97463198-6
  return location.host.indexOf(host) !== -1 && <Helmet>
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`}></script>
    <script>{`window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${id}');`}
    </script>
  </Helmet>;
}
