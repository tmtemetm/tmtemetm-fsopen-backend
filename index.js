require('dotenv').config()
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(express.static('dist'))

app.use(cors())

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const personsBaseUrl = '/api/persons'
const PORT = process.env.PORT || 3001

app.get(personsBaseUrl, (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
    .catch(next)
})

app.get(`${personsBaseUrl}/:id`, (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(next)
})

app.post(personsBaseUrl, (request, response, next) => {
  const { name, number } = request.body
  new Person({ name, number })
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(next)
})

app.put(`${personsBaseUrl}/:id`, (request, response, next) => {
  const { name, number } = request.body
  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(next)
})

app.delete(`${personsBaseUrl}/:id`, (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(next)
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({}).then(count => {
    response.send(
      `<div>
        <p>
          Phonebook has info for ${count} people
        </p>
        <p>
          ${new Date()}
        </p>
      </div>`
    )
  })
    .catch(next)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400)
      .json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400)
      .json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
