/**
 * ### Расщирение сервисворкера
 *
 * @module sw-ext
 *
 * Created by Evgeniy Malyarov on 16.09.2018.
 */

self.addEventListener('sync', function(event) {
  if (event.tag == 'myFirstSync') {
    event.waitUntil(doSomeStuff());
  }
});
