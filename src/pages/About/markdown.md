# Flowcon.js
Flowcon.js - это один из интерфейсов программно-методического комплекса управления потоками задач

### Назначение и возможности
- Ввод и редактирование докумнтов поступления - выбытия - перемещения денег
- Формирование отчета о движении денег
- Автономная работа при отсутствии доступа к Интернет
- Фоновая синхронизация с ИБ 1С

### Использованы следующие библиотеки и инструменты:

#### Серверная часть
- [CouchDB](http://couchdb.apache.org/), NoSQL база данных с поддержкой master-master репликации
- [Nginx](http://nginx.org/ru/), высокопроизводительный HTTP-сервер
- [NodeJS](https://nodejs.org/en/), JavaScript runtime built on Chrome`s V8 JavaScript engine
- [SuperLogin](https://github.com/colinskow/superlogin), библиотека oAuth авторизации

#### Управление данными в памяти браузера
- [Metadata.js](http://www.oknosoft.ru/metadata/), движок ссылочной типизации для браузера и Node.js
- [PouchDB](https://pouchdb.com/), клиентская NoSQL база данных с поддержкой автономной работы и репликации с CouchDB
- [AlaSQL](https://github.com/agershun/alasql), SQL-интерфейс к массивам javascript в памяти браузера и Node.js
- [Aes](http://www.movable-type.co.uk/scripts/aes.html), библиотека шифрования/дешифрования строк
- [Redux](https://github.com/reactjs/redux), диспетчер состояния веб-приложения        

#### UI библиотеки и компоненты интерфейса
- [Material-ui](http://www.material-ui.com/), компоненты React UI в стиле Google`s material design
- [React virtualized](https://github.com/bvaughn/react-virtualized), компоненты React для динамических списков
- [React data grid](https://github.com/adazzle/react-data-grid), React компонент табличной части
- [Moment.js](http://momentjs.com/), библиотека форматирования интервалов и дат
- [Rubles.js](http://meritt.github.io/rubles/), библиотека форматирования чисел - сумма прописью
- [Xlsx](https://github.com/SheetJS/js-xlsx), библиотека для чтения и записи XLSX / XLSM / XLSB / XLS / ODS
- [Docxtemplater](https://github.com/open-xml-templating/docxtemplater), библиотека формирования файлов DOCX
- [Fontawesome](https://fortawesome.github.io/Font-Awesome/), набор шрифтовых иконок

### Лицензия
[MIT](https://ru.wikipedia.org/wiki/%D0%9B%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F_MIT)

### Вопросы
Если обнаружили ошибку, пожалуйста, <a href="https://github.com/oknosoft/windowbuilder/issues/new" target="_blank" rel="noopener noreferrer">зарегистрируйте вопрос в GitHub</a> или <a href="mailto:info@oknosoft.ru">свяжитесь с разработчиком</a> напрямую
