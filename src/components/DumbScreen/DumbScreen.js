import React, {Component} from 'react';
import PropTypes from 'prop-types';

class DumbScreen extends Component {

  render() {

    let {title, page, top, first_run} = this.props;
    const over = page && page.limit * page.page > page.total_rows;
    if (!title) {
      title = (first_run || over) ? 'Синхронизация при первом запуске...' : 'Загрузка модулей...';
    }
    const footer = page ? (over ?
      <div>{`Такт №${page.page}, загружено ${page.total_rows} объектов - чтение изменений `} <i className="fa fa-spinner fa-pulse"></i></div>
      :
      page.text || `Такт №${page.page}, загружено ${Math.min(page.page * page.limit, page.total_rows)} из ${page.total_rows} объектов`)
    : '';

    return <div className='splash' style={{marginTop: top}}>
      <div className="description">
        <h1 itemProp="name">business-programming</h1>
        <p>Категория: <span itemProp="applicationSubCategory">management</span></p>
        <div itemProp="description">
          <p>Управление бизнесом, ресурсами и потоками задач</p>
        </div>
      </div>

      <div style={{position: 'absolute', bottom: '-24px', whiteSpace: 'nowrap'}}>{title}</div>
      {page && <div style={{position: 'absolute', bottom: '-52px', whiteSpace: 'nowrap'}}>{footer}</div>}

    </div>;
  }
}

DumbScreen.propTypes = {
  step: PropTypes.number,
  step_size: PropTypes.number,
  count_all: PropTypes.number,
  top: PropTypes.number,
  first_run: PropTypes.bool,
  title: PropTypes.string,
  processed: PropTypes.string,
  current: PropTypes.string,
  bottom: PropTypes.string,
  page: PropTypes.object,
};

export default DumbScreen;
