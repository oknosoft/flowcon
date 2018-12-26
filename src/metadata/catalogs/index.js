// модификаторы справочников

// дополнительные реквизиты и сведения
import cat_articles from "./cat_articles";
import cat_activity_mod from "./cat_activity_mod";
import cat_users from "./cat_users_mod";

export default function ($p) {
  cat_articles($p);
  cat_activity_mod($p);
  cat_users($p);
}
