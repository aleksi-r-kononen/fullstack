import { useState, useEffect } from 'react'
import nameService from './services/names.js'

const Filter = ({ value, onChange }) => 
  <>filter shown with <input value={value} onChange={onChange} /></>

const PersonForm = ({ addName, name, handleNameChange, number, handleNumberChange }) => (
  <form onSubmit={addName}>
    <div>
      name: <input value={name} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={number} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ persons, filter, handleRemoveName }) => (
  <ul>
    {persons.filter(person =>
        person.name.toLowerCase().includes(filter)
      ).map(person =>
        <li key={person.id}>
          {person.name} {person.number} 
          <button onClick={() => handleRemoveName(person)}>delete</button>
        </li>
    )}
  </ul>
)

const Message = ({ message, color }) => {
  if (message === null)
    return null

  const style = {
    color: color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <p style={style}>
      {message}
    </p>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    console.log('Using effect')
    nameService
      .getAll()
      .then(data => setPersons(data))
  }, [])
  console.log('Rendering with', persons.length, 'names saved')

  const addName = (event) => {
    event.preventDefault()
    
    const nameObject = { 
      name: event.target[0].value,
      number: event.target[1].value
    }

    if (persons.map(p => p.name).includes(nameObject.name)) {
      if (!window.confirm(`${nameObject.name} is already added to phonebook, replace the old number with a new one?`))
        return

      const existingPerson = persons.filter(p => p.name === nameObject.name)[0]
      console.log("Updating person", existingPerson)

      nameService
        .update(existingPerson.id, nameObject)
        .then(response => {
          setPersons(persons.map(p => p.id === existingPerson.id ? response : p))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(
            `Updated ${nameObject.name}`
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch(() => {
          setErrorMessage(
            `Information of ${nameObject.name} has already been removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })

      return
    }

    nameService
      .create(nameObject)
      .then(data => {
        setPersons(persons.concat(data))
        setNewName('')
        setNewNumber('')
        setSuccessMessage(
          `Added ${data.name}`
        )
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
      .catch(error => {
        console.log("frontend received creation error", error)
        setErrorMessage(error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const handleNameChange = (event) =>
    setNewName(event.target.value)

  const handleNumberChange = (event) =>
    setNewNumber(event.target.value)
  
  const handleFilterChange = (event) =>
    setNewFilter(event.target.value)
  
  const handleRemoveName = (person) => {
    console.log("Called remove for", person.name)
    if (!window.confirm(`Delete ${person.name}?`))
      return

    console.log("Removing", person.name)
    nameService
      .remove(person.id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== person.id))
        setSuccessMessage(
          `Removed ${person.name}`
        )
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Message message={successMessage} color={'green'} />
      <Message message={errorMessage} color={'red'} />

      <Filter value={newFilter} onChange={handleFilterChange} />

      <h3>Add a new number</h3>

      <PersonForm addName={addName}
        name={newName} handleNameChange={handleNameChange}
        number={newNumber} handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons persons={persons} filter={newFilter} handleRemoveName={handleRemoveName}/>
    </div>
  )

}

export default App