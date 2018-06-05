// модификаторы объектов и менеджеров данных

// общие модули
import common from './common';

// модификаторы перечислений
import enums from "./enums";

// модификаторы справочников
import catalogs from "./catalogs";

// модификаторы документов
import documents from "./documents";

// модификаторы планов видов характеристик
//import chartscharacteristics from "./chartscharacteristics";

// модификаторы отчетов
//import reports from "./reports";


export default function ($p) {
  common($p);
  enums($p);
  catalogs($p);
  //chartscharacteristics($p);
  documents($p);
  //reports($p);
}
