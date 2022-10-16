const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res, 'Body: '), 
  ].join(' ')
}))



let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.status(200).json(persons);
})

app.get('/info', (request, response) => {
  const notesPersons = persons.length;
  const timeStamp = new Date().toString();
  const info = `Phonebook has info for ${notesPersons} people <br /> ${timeStamp}`;  
  response.send(`<p>${info}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.filter(person => person.id === id);
  
  if(person.length !== 0) {
    response.status(200).json(person);    
  } 
  response.status(404).end();  
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.filter(person => person.id !== id);
  
  if(person.length !== 0) {
    response.status(400).json(person);    
  } 
  // response.status(404).end();  
})

app.post('/api/persons/', (request, response) => {
  
  const id = Math.floor(Math.random()* 1000);
  const body = request.body;
  const newEntry = {
    'id': id,
    'name': body.name,
    'number': body.number
  }
  if(!body.name || !body.number) {
    response.status(400).json({
      error: 'Content missing in the request'
    });
  } 

  if(persons.map(person => person.name).includes(newEntry.name)) {
    response.status(400).json({
      error: 'Name must be unique'
    });
  };
  

  persons = persons.concat(newEntry);  
  response.status(200).json(newEntry);
})

const PORT = process.env.port || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

