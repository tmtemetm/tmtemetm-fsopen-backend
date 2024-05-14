const cors = require('cors')
const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.json())

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

const generateId = () =>
  Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

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

  if (persons.some(person => person.name === name)) {
    return response.status(400)
      .json({
        error: 'name must be unique'
      })
  }

  const person = {
    id: generateId(),
    name,
    number
  }
  persons = persons.concat(person)

  response.json(person)
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
