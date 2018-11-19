# act.js

This project focuses on creating a JavaScript library that will help to create user
interfaces. The main advantage of the proposed solution is its speed of
loading new elements on the screen. The designed library was tested using a test application which was implemented also in React, Angular 2 and Ember.

## Speed test with other libraries:
- First load time

|  | React | Angular 2 | Ember | Act.js |
| --- | --- | --- | --- | --- |
| DOMContentLoaded | ~321 ms | ~1050 ms | ~803 ms | ~210 ms |

- Update of 1 element in a list of 10k elements

|  | React | Angular 2 | Ember | Act.js |
| --- | --- | --- | --- | --- |
| Model update | 44.4 ms | 49.6 ms | 3315.1 ms | 22.2 ms |
| Frames per second | 22 | 20 | 0.3 | 44 |

## Hello world example:
The code of the smallest application created with the designed library displaying the words "Hello World!" on the screen looks 
as follows:
- index.js:

```
const root = document.body;

class App extends Component {
  render() {
    return createElement('div', {}, 'Hello World!'); 
  }
}

mount(createElement(App), root);
```

The above code consists of a base component that renders "Hello World!" on the screen. The `createElement()` function is 
responsible for creating a virtual node. The `mount()` function runs when the `index.js` file is loaded and is responsible 
for the first loading of the HTML template. In addition, an `index.html` file is required, which is the default main page of 
the website.
- index.html:
 
 ```
<html>
  <head>
    <script src="lib/act.js"></script>
  </head>
  <body>
    <script src="./index.js"></script> 
  </body>
</html>
```

The index.html file is read by the server. Then the JavaScript files are downloaded. Firstly, act.js file containing the 
source code of the library. Secondly, the index.js file containing the test application code. The index.js file is loaded 
in the body section of the HTML file because it manipulates HTML DOM.
