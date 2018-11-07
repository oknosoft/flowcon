// общие модули

// строки интернационализации
import i18ru from "./i18n.ru";

import superlogin from "./superlogin";

export default function ($p) {
  i18ru($p);
  superlogin($p);
}
