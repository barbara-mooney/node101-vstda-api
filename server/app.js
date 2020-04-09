const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

let todoData = [
  {
    todoItemId: 0,
    name: 'an item',
    priority: 3,
    completed: false
  },
  {
    todoItemId: 1,
    name: 'another item',
    priority: 2,
    completed: false
  },
  {
    todoItemId: 2,
    name: 'a done item',
    priority: 1,
    completed: true
  }
]

app.get('/', (req, res) => {
  res.status(200).json({ "status":"Ok" });
})

app.get('/api/TodoItems', (req, res) => {
  res.status(200).send(todoData);
})

app.get('/api/TodoItems/:number', (req, res) => {
  let todoExists = false;
  let position;
  for (let i=0; i<todoData.length; i++) {
    if (req.params.number == todoData[i].todoItemId) {
      todoExists = true;
      position = i;
    };
  };
  if (todoExists)
    res.status(200).send(todoData[position]);
  else
    res.status(404).send('Incorrect ID number');
});

app.post('/api/TodoItems/', (req, res) => {
  let id = req.body.todoItemId;
  let todoExists = false;
  todoData.forEach(object => {
    if (object.todoItemId == id) {
      todoExists = true;
      object.name = req.body.name;
      object.priority = req.body.priority;
      object.completed = req.body.completed;
    };
  });
  if (!todoExists)
    todoData.push(req.body);
  res.status(201).send(req.body);
});

app.delete('/api/TodoItems/:number', (req, res) => {
  let id = req.params.number;
  let todoExists = false;
  let position;
  todoData.forEach((object, i) => {
    if ((object.todoItemId) == id) {
      todoExists = true;
      position = i;
    };
  });
  if (todoExists) {
    res.status(200).send(todoData[position]);
    todoData.splice(position, 1);
  } else {
    res.status(404).send('There is no todo with such ID.');
  };
});

app.get('*', (req, res) => {
  res.status(200).send('No such page');
});

module.exports = app;
