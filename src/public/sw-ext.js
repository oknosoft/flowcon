/**
 * ### Расщирение сервисворкера
 *
 * @module sw-ext
 *
 * Created by Evgeniy Malyarov on 16.09.2018.
 */

self.addEventListener('sync', function(event) {
  if (event.tag == 'reload') {
    event.waitUntil(reloadStuff());
  }
});

function reloadStuff() {
  return Promise.resolve();
}
