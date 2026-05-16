import { useState, useEffect } from 'react'
import Footer from './components/Footer'
import service from './services/backend'
import Notification from './components/Notifications'

//this is the search filter
const Filter = ({search, setSearch}) => {
    const handleSearch = (event) => {
        setSearch(event.target.value)
    }

    return(
        <form>
            filter shown with <input value={search} onChange={handleSearch}/>
        </form>
    )
}

//compoment for adding new people
const PersonForm = (props) => {

    return(
    <div>
    <h2>Add a new number</h2>
    <form onSubmit={props.detail}>
        <div>
          name: <input value={props.name} onChange={props.handleName} />
        </div>
        <div>
          number: <input value={props.number} onChange={props.handleNumber}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
    </div>
    )

}


//component for rendering details
const Persons = ({result, handleDelete}) => {
    return(
        <div>
            <h2>Details</h2>
            <ul>
            {result.map(person =>
                <li key={person.id}>
                    {person.name} {person.number} <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
                </li>
            )}
            </ul>
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [search, setSearch] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [isError, setError] = useState(false)
    console.log('main')

useEffect(()=>{
    service
    .getAll()
    .then(response => {
        setPersons(response.data)
        console.log('effect happened')
    })
     }, [])

const addDetails = (event) => {
    event.preventDefault()
    const object = {
        name: newName,
        number: newNumber
    }

    const checkDupes = persons.find(
            (person) => person.name === newName
        )

    if(newName===''){
        setError(true)
        setErrorMessage("Name can not be empty")

            setTimeout(()=>{
            setErrorMessage(null)
        }, 5000)
        return
    }

    if(checkDupes){
        if(window.confirm(`${newName} is already added to phonebook,replace the old number with new one?`)){
            const updated = {...checkDupes, number: newNumber}

            service
            .update(checkDupes.id, updated)
            .then(response =>{
                setPersons(persons.map(person => person.id !== checkDupes.id ? person : response.data))
                setNewName('')
                setNewNumber('')
            })
            .catch((error)=>{
                setError(true)
                setErrorMessage(`info of ${newName} already removed from the server`)

                setTimeout(()=>{
                    setErrorMessage(null)
                }, 5000)
            })
        }
        return
    }

        service
        .create(object)
        .then(response => {
            setPersons( (person) => [...person, response.data])
            setNewName('')
            setNewNumber('')
            setError(false)
            setErrorMessage(`added ${object.name} `)
            setTimeout(()=>{
                setErrorMessage(null)
            }, 5000)
        })
  }

  const handleName = (event) => {
    setNewName(event.target.value)
  }

  const handleNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const result = search === '' ? persons : persons.filter(person =>
        person.name.toLowerCase().includes(search.toLowerCase())
  )

  const delPer = (id, name) => {
    if(window.confirm(`Delete ${name}`)){
        service
        .del(id)
        .then(()=>{
            setPersons(persons.filter(person => person.id !== id))
            console.log("then working")
        })
        .catch(error => {
                alert(`Error ${name} was already deleted from the server`)
        })
    }
}
  return (
    <div>
      <h2 className="pbook">Phonebook</h2>
      <Filter search={search} setSearch={setSearch} />
      <PersonForm detail={addDetails} name={newName} number={newNumber} handleNumber={handleNumber} handleName={handleName}/>
      <Notification message={errorMessage} isError={isError}/>
      <Persons result={result} handleDelete={delPer}/>
      <Footer />
    </div>
  )
}

export default App
