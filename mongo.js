const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Password argument missing')
  process.exit(1)
}
const password = process.argv[2]
const url = `mongodb+srv://tmtemetm:${password}@tmtemetm-fsopen.vexfuav.mongodb.net/?retryWrites=true&w=majority&appName=tmtemetm-fsopen`
mongoose.set('strictQuery', false)
mongoose.connect(url)


const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', personSchema)

const printPersons = () => {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

const savePerson = (name, number) => {
  const person = new Person({
    name,
    number
  })

  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length < 5) {
  printPersons()
} else {
  savePerson(process.argv[3], process.argv[4])
}
