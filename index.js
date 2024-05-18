require('dotenv').config()
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(express.static('dist'))

app.use(cors())

morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const personsBaseUrl = '/api/persons'
const PORT = process.env.PORT || 3001

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
  Person.find({}).then(persons => {
    response.json(persons)
  })
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

app.post(personsBaseUrl, (request, response) => {
  const { name, number } = request.body

  if (!name) {
    return response.status(400)
      .json({
        error: 'name missing'
      })
  }

  if (!number) {
    return response.status(400)
      .json({
        error: 'number missing'
      })
  }

  const person = new Person({
    name,
    number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.delete(`${personsBaseUrl}/:id`, (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
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
