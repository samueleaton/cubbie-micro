# Cubbie Micro

Small. Stupid. Simple. State Storage.

<br>  
<p align="center">
<img width="350" title="cubbie" alt="cubbie!" src="https://raw.githubusercontent.com/samueleaton/design/master/cubbie.png">    
</p>
<br>  

> State shouldn't be a chore, keep your state in Cubbie's store

<br>  

## The Lowdown

Cubbie allows the creation of state stores. Cubbie micro differs from cubbie in that it will only keep track of the current and previous state. It is built on an event system that allows anybody to listen for any state event. [Event namespacing](docs/event_system.md#event-namespacing) is available to keep things manageable as lots of events are added.

## Installation

```
npm i -S cubbie-micro
```

or

```
yarn add cubbie-micro
```

## Usage

### Creating a Store

``` javascript
const cubbie = require('cubbie-micro');

const store = cubbie.createStore();
```

Each store you create is independent, each managing its own state history. So if you want multiple <sub>smaller stores</sub> in your app rather than one **large store**, Cubbie will allow it.

``` javascript
const heroes = cubbie.createStore();
const villains = cubbie.createStore();
```

### Initial State

Before you can start tracking state, you need to set an initial state:

``` javascript
store.setInitialState({ currentPage: 'home', loggedIn: true, etc: '...' });
```

`initialState` triggers the `STATE_SET` event. See the **Events** section.

To get the initial state:

``` javascript
store.initialState;
```

### Current State

Accessing the current state is as simple as accessing the `state` property.

``` javascript
store.state;
```

### Modifying State

This is the key to Cubbie's simplicity. To modify state, just pass a function to `modifyState`. The only parameter of that function is the new state that you get to modify before it is set as the new state. 

``` javascript
store.modifyState(state => {
    state.x = y;
    state.z = 11;
    // etc.
});
```

This is an immutable operation and the newly modified state object will become the current state, and what *was* the current state will become the previous state.

`modifyState` triggers the `STATE_MODIFIED` event. See [The Event System](docs/event_system.md).

`modifyState` will return the new current state.

### State History

*Not available in Cubbie Micro (only in Cubbie Original)*

### Get Previous State

This returns the state immediately before the current state.

``` javascript
store.previousState;
```

### Views

Similar in purpose to SQL views, views allow you to store a function that you can call on at any moment. Its just some good ol' logic abstraction.

Example (using lodash's `maxBy`)

``` javascript
console.log(store.state); /* 
{ people: [
    {name: 'cat', age: 13}, {name: 'sam', age: 25}, {name: 'jas', age: 20}
  ]
}
*/


store.createView('oldestPerson', state => {
  return _.maxBy(state.people, person => person.age);
});

store.view('oldestPerson'); // {name: 'sam', age: 25}
```

### The Event System

See [The Event System](docs/event_system.md)


### Usage with React

<img width="180" title="cubbie plus node" alt="cubbie plus node" src="https://raw.githubusercontent.com/samueleaton/design/master/cubbie_plus_react.png"> 

See **[Using Cubbie With React](docs/cubbie_with_react.md)**
