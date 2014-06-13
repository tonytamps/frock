var frock = {
  responseQueue: Ember.A(),
  checkQueueInterval: null,

  on: function on(){
    fakehr.start();
  },

  off: function off(){
    fakehr.reset();
    frock.clear();
  },

  mock: function add(verb, url, body, status) {
    if(typeof body !== 'string' && typeof body !== 'function') { body = JSON.stringify(body); }

    var newItem = { verb: verb, url: url, body: body, status: status };

    var existingQueuedItem = frock.responseQueue.find(function(item) {
      return item.verb === newItem.verb && item.url === newItem.url;
    });

    if (existingQueuedItem) frock.responseQueue.removeObject(existingQueuedItem);

    frock.responseQueue.push(newItem);

    if (!frock.checkQueueInterval) frock.checkQueueInterval = window.setInterval(frock.check, 20);
  },

  clear: function clear() {
    frock.responseQueue = Ember.A();
    window.clearInterval(frock.checkQueueInterval);
    frock.checkQueueInterval = null;
  },

  check: function() {
    for (var i = 0; i < frock.responseQueue.length; i++) {
      var queuedItem = frock.responseQueue[i];

      var found = fakehr.match(queuedItem.verb.toUpperCase(), queuedItem.url);

      if (found) {
        if (typeof queuedItem.body === 'function') {
          var obj = JSON.parse(found.requestBody);
          queuedItem.body = JSON.stringify(queuedItem.body(obj));
        }
        found.respond(queuedItem.status || 200, {'content-type': 'application/json'}, queuedItem.body);
      }
    }
  }
};

export default frock;

