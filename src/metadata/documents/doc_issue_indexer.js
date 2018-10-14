/**
 *
 *
 * @module doc_issue
 *
 * Created by Evgeniy Malyarov on 11.10.2018.
 */

const fields = '_id,date,number_doc,definition,caption,mark,quickly,important,initiator,executor,history,canceled,completed,executor_accepted,initiator_accepted'.split(',');
const search_fields = ['definition','caption'];

export default function indexer() {
  const {adapters: {pouch}, doc: {issue}, classes} = $p;
  const {remote} = pouch;
  const mngrs = [issue];

  for(const db in remote) {
    if(db !== 'remote' && db !== issue.cachable) {
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
        let dfrom, dtill, from, till, search = [];
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
        }

        if(sort && sort.length && sort[0][Object.keys(sort[0])[0]] === 'desc' || sort === 'desc') {
          sort = 'desc';
        }
        else {
          sort = 'asc';
        }

        const {_search_fields} = this;
        const {utils} = $p;

        let part,
          // выборка диапазона кеша
          step = 0,
          // флаг поиска страницы со ссылкой
          flag = skip === 0 && utils.is_guid(ref),
          // результат поиска строки со ссылкой
          scroll = 0,
          count = 0;

        const docs = [];

        function add(doc) {
          count++;
          if(flag && doc._id.endsWith(ref)) {
            scroll = count - 1;
            flag = false;
          }
          if(skip > 0) {
            return skip--;
          }
          if(limit > 0) {
            limit--;
            docs.push(doc);
          }
        }

        function check(doc) {

          // фильтруем по дате
          if(doc.date < dfrom || doc.date > dtill) {
            return;
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

          ok && add(doc);
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

        return {docs, scroll, flag, count};
      }
    }

    issue._indexer = new RamIndexer({fields, search_fields, mgr: mngrs});
  }
  for(const mngr of mngrs) {
    if(mngr !== issue) {
      mngr._indexer = issue._indexer;
    }
  }

  return issue._indexer
    .init()
    .catch($p.record_log);
}
