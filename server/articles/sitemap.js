/**
 * рендерит sitemap.xml
 *
 * @module sitemap
 *
 * Created by Evgeniy Malyarov on 05.09.2018.
 */

const xml = require('fs').readFileSync(require.resolve('./sitemap.xml'), 'utf8');

module.exports = function (req, res, next) {
  if(!req.url.match(/^\/sitemap\.xml/)) {
    return next();
  }
  res
    .status(200)
    .set('Content-Type', 'application/xml; charset=utf-8')
    .send(xml);
}
