const morgan = require('morgan')
const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

morgan.token('data', (req) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status - :response-time ms :data'))

let persons = [
    {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

app.get('/', (request,response) => {
    response.send('<h1>Backend is working fine</h1>')
})

app.get('/api/persons',(request,response) =>{
    response.json(persons)
})

app.get('/api/persons/:id',(request,response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if(person){
        response.json(person)
    } else{
        response.status(404).end()
    }
})

app.get('/info', (request,response) =>{
    const num = persons.length
    const current = new Date()

    response.send(`
        <p>Phonebook has info for ${num} people</p>
        <p>${current}</p>
    `)
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const Id = Math.random()*1000000;

    if(!body.name || !body.number){
        return response.status(400).json({
            error: "name or number not found"
        })
    }

    const lookup = persons.find(person => person.name === body.name)

    if(lookup){
        return response.status(400).json({
            error: "name must be unique"
        })
    }

    const person = {
        id : Math.ceil(Id),
        name : body.name,
        number : body.number
    }

    persons = persons.concat(person)
    response.status(200).json(persons)
})

app.delete('/api/persons/:id', (request,response) => {
    const id = request.params.id
    const person =
    persons.find(person => person.id === id)

    if(person){
        persons = persons.filter(person => person.id !== id)
        response.status(204).end()
    } else {
        response.status(204).end()
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)
})
