const express = require('express')
const app = express()

const personsBaseUrl = '/api/persons'
const PORT = 3001

let persons = [
  { 
    id: 1,
    name: 'Arto Hellas', 
    number: '040-123456'
  },
  { 
    id: 2,
    name: 'Ada Lovelace', 
    number: '39-44-5323523'
  },
  { 
    id: 3,
    name: 'Dan Abramov', 
    number: '12-43-234345'
  },
  { 
    id: 4,
    name: 'Mary Poppendick', 
    number: '39-23-6423122'
  }
]

app.get(personsBaseUrl, (request, response) => {
  response.json(persons)
})

app.get(`${personsBaseUrl}/:id`, (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404)
      .end()
  }
})

app.delete(`${personsBaseUrl}/:id`, (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204)
    .end()
})

app.get('/info', (request, response) => {
  response.send(
    `<div>
      <p>
        Phonebook has info for ${persons.length} people
      </p>
      <p>
        ${new Date()}
      </p>
    </div>`
  )
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
