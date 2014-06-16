frock
=====

An HTTP request mocking helper

## Usage

### Include the dependencies
```
<script src="bower_components/FakeXMLHttpRequest/fake_xml_http_request.js"></script>
<script src="bower_components/fakehr/fakehr.js"></script>
<script src="bower_components/frock/frock.js"></script>
```

### Setup

```
module('Client Tests', {
  setup: function () {
    frock.on();
  },
  teardown: function () {
    frock.off();
  }
  // ...tests...
});
```

### Mocking Requests
```
frock.mock(httpMethod, url, responseBody, httpStatusCode);
```
`frock.mock` takes 3 parameters with an optional 4th. Adding a duplicate httpMethod and url combination will remove existing one.


```
// ...setup...
test('can create new user', function() {
  frock.mock('post', '/api/users/create', {
    user: {
      id: 1,
      name: "Tony T"
    }
  }, 201);
  
  visit('/users/create');
  fillIn('[name="name"]', 'Tony T');
  click('button[type="submit"]');
  andThen(() => {
    // ...Make your assertions...
  });
});
```

The mock response can be a function to be executed that generates the response. It's okay to return an object, it'll be stringified.

```
// ...setup...
test('can get user', function() {
  var whoRules = function(){ 
    return { tony: "rules" };
  }
  
  frock.mock('get', '/api/users', whoRules);
  
  visit('/users');
  andThen(() => {
    // ...Make your assertions...
  });
});
```
