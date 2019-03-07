/**
 *
 *
 * @module doc_issue
 *
 * Created by Evgeniy Malyarov on 11.10.2018.
 */

const fields = ('_id,date,number_doc,definition,caption,mark,quickly,important,execution_period,initiator,responsible,executor,state_date,canceled,completed,specify,' +
  'executor_accepted,initiator_accepted,quickly_setted,processing').split(',');
const search_fields = ['definition','caption'];

function subscribe(mngrs) {

  const {articles} = $p.cat;
  let res = Promise.resolve();

  if(mngrs.length < 5) {
    for(const mngr of mngrs) {
      if(mngr._indexer_listener && mngr._indexer_listener.cancel) {
        mngr._indexer_listener.cancel();
        mngr._indexer_listener = '';
      }
      res = res.then(() => new Promise((resolve, reject) => {
        let finished;
        mngr._indexer_listener = mngr.pouch_db.changes({
          since: 'now',
          live: true,
          include_docs: true,
          selector: {class_name: {$in: [mngr.class_name, articles.class_name]}}
        }).on('change', (change) => {
          const cmgr = change.id.startsWith(mngr.class_name) ? mngr : articles;
          cmgr.emit('change', change.deleted ? {_id: change.id, _deleted: true} : change.doc);
        }).on('error', (err) => {
          if(!finished) {
            finished = true;
            reject(err);
          }
        });
        setTimeout(() => {
          if(!finished) {
            finished = true;
            resolve();
          }
        }, 180);
      }));
    }
  }
  else {
    for(const mngr of mngrs) {
      if(mngr._indexer_listener && mngr._indexer_listener.cancel) {
        mngr._indexer_listener.cancel();
        mngr._indexer_listener = '';
      }
      res = res.then(() => {
        mngr.pouch_db.changes({
          limit: 100,
          since: mngr._indexer_listener || 'now',
          include_docs: true,
          selector: {class_name: {$in: [mngr.class_name, articles.class_name]}}
        })
          .then((result) => {
            for(const change of result.results) {
              const cmgr = change.id.startsWith(mngr.class_name) ? mngr : articles;
              cmgr.emit('change', change.deleted ? {_id: change.id, _deleted: true} : change.doc);
            }
            mngr._indexer_listener = result.last_seq;
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
    res = res.then(() => {
      subscribe.timer = setTimeout(subscribe.bind(null, mngrs), 20000);
    });
  }

  return res;
}

function unsubscribe(mngrs) {
  if(subscribe.timer) {
    clearTimeout(subscribe.timer);
  }
  for(const mngr of mngrs) {
    if(mngr._indexer_listener && mngr._indexer_listener.cancel) {
      mngr._indexer_listener.cancel();
    }
    mngr._indexer_listener = '';
  }
}

export default function indexer() {

  const {adapters: {pouch}, doc: {issue}, classes, utils} = $p;
  const {remote} = pouch;
  const {blank} = utils;
  const mngrs = [issue];

  for(const db in remote) {
    if(!/^(doc|log|remote)$/.test(db)) {
      const mngr = new issue.constructor($p.doc, issue.class_name);
      mngr._cachable = db;
      mngrs.push(mngr);
    }
  }

  // создаём
  if(issue._indexer) {
    issue._indexer.reset(mngrs);
  }
  else {
    class RamIndexer extends classes.RamIndexer {
      // перебирает кеш в диапазоне дат
      find({selector, sort, ref, limit, skip = 0}) {

        if(!this._ready) {
          const err = new Error('Индекс прочитн не полностью, повторите запрос позже');
          err.status = 403;
          throw err;
        }

        // извлекаем значения полей фильтра из селектора
        let dfrom, dtill, from, till, responsible, search = [], conditions = [];
        for(const row of selector.$and) {
          const fld = Object.keys(row)[0];
          const cond = Object.keys(row[fld])[0];
          if(fld === 'date') {
            if(cond === '$lt' || cond === '$lte') {
              dtill = row[fld][cond];
              till = dtill.substr(0,7);
            }
            else if(cond === '$gt' || cond === '$gte') {
              dfrom = row[fld][cond];
              from = dfrom.substr(0,7);
            }
          }
          else if(fld === 'search') {
            search = row[fld][cond] ? row[fld][cond].toLowerCase().split(' ') : [];
          }
          else if(fld === 'responsible') {
            responsible = row[fld];
          }
          else if(fields.includes(fld)) {
            conditions.push(RamIndexer.truth(fld, row[fld]));
          }
        }

        if(sort && sort.length && sort[0][Object.keys(sort[0])[0]] === 'desc' || sort === 'desc') {
          sort = 'desc';
        }
        else {
          sort = 'asc';
        }

        const {_search_fields} = this;

        let part,
          // выборка диапазона кеша
          step = 0,
          // флаг поиска страницы со ссылкой
          flag = skip === 0 && utils.is_guid(ref),
          // результат поиска строки со ссылкой
          scroll = null,
          count = 0;

        const docs = [];

        function check(doc) {

          // фильтруем по дате
          if(doc.date < dfrom || doc.date > dtill) {
            return;
          }

          // фильтруем по ответственному
          if(responsible && doc.initiator !== responsible && doc.executor !== responsible) {
            return;
          }

          // фильтруем по булевым условиям
          for(const fn of conditions) {
            if(!fn(doc)) {
              return;
            }
          }

          // фильтруем по строке
          let ok = true;
          for(const word of search) {
            if(!word) {
              continue;
            }
            if(!_search_fields.some((fld) => {
              const val = doc[fld];
              return val && typeof val === 'string' && val.toLowerCase().includes(word);
            })){
              ok = false;
              break;
            }
          }

          ok && docs.push(doc);
        }

        // получаем очередной кусочек кеша
        while((part = this.get_range(from, till, step, sort === 'desc'))) {
          step += 1;
          // фильтруем
          if(sort === 'desc') {
            for(let i = part.length - 1; i >= 0; i--){
              check(part[i]);
            }
          }
          else {
            for(let i = 0; i < part.length; i++){
              check(part[i]);
            }
          }
        }

        // sort, skip, limit, scroll
        docs.sort((a, b) => {
          if (a.state_date > b.state_date || (a.state_date && !b.state_date)) {
            return 1;
          }
          if (a.state_date < b.state_date || (b.state_date && !a.state_date)) {
            return -1;
          }
          return 0;
        });
        count = docs.length;
        if(flag) {
          docs.some((doc, index) => {
            if(doc._id.endsWith(ref)){
              flag = false;
              scroll = index;
            }

          });
        }

        return {
          docs: limit ? docs.splice(skip, limit) : docs,
          scroll,
          flag,
          count
        };
      }

      // чистит кеш и подписки на события
      reset(mgrs) {
        unsubscribe(this._mgrs);
        super.reset(mgrs);
      }

      // вычисляемые поля
      put(indoc, force) {
        // отменённые не требуют обработки
        if(indoc.canceled) {
          indoc.processing = false;
        }
        // если нас назначили, а мы еще не приняли в работу
        else if(indoc.executor === this.current_user && !indoc.executor_accepted) {
          indoc.processing = true;
        }
        // если мы ответственный и не назначили исполнителя
        else if(indoc.responsible === this.current_user && (!indoc.executor || indoc.executor === blank.guid)) {
          indoc.processing = true;
        }
        // проверить исполнение
        else if(indoc.initiator === this.current_user && indoc.completed && !indoc.initiator_accepted) {
          indoc.processing = true;
        }
        // доработать, если мы инициатор и отправлено на доработку
        else if(indoc.initiator === this.current_user && indoc.specify) {
          indoc.processing = true;
        }
        else {
          indoc.processing = false;
        }

        super.put(indoc, force);
      }
    }

    issue._indexer = new RamIndexer({fields, search_fields, mgr: mngrs});
  }
  for(const mngr of mngrs) {
    if(mngr !== issue) {
      mngr._indexer = issue._indexer;
    }
  }

  return subscribe(mngrs)
    .then(() => {
      issue._indexer.current_user = $p.current_user.ref;
      return issue._indexer.init();
    })
    .then(() => {
      return issue.emit('change');
    })
    .catch($p.record_log);
}
