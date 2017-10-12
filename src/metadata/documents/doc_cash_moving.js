/**
 * ### Модуль менеджера и документа Перемещение денег
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2017
 *
 * @module doc_cash_moving
 * Created 28.07.2016
 */

export default function ({DocCash_moving, msg}) {
  /**
   * Обработчик перед записью документа
   */
  DocCash_moving.prototype.before_save = function () {

    // как минимум, одна касса должна быть заполнена
    if(this.sender.empty() && this.recipient.empty()) {

      msg.show_msg({
        title: msg('mandatory_title'),
        type: 'alert-error',
        text: msg('mandatory_one_cashbox')
      });

      return false;
    }

  };

}
