// модификаторы объектов и менеджеров данных

// общие модули
import common from './common';

// модификаторы справочников
//import catalogs from "./catalogs";

// модификаторы документов
import documents from "./documents";

// модификаторы планов видов характеристик
import chartscharacteristics from "./chartscharacteristics";

// модификаторы отчетов
import reports from "./reports";


export default function ($p) {
  //catalogs($p);
  documents($p);
  chartscharacteristics($p);
  reports($p);
  common($p);
}
