import { useState } from 'react'

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

const Persons = ({ persons, filter }) => (
  <ul>
    {persons.filter(person =>
        person.name.toLowerCase().includes(filter)
      ).map(person =>
        <li key={person.name}>{person.name} {person.number}</li>
    )}
  </ul>
)

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const addName = (event) => {
    event.preventDefault()
    
    const nameObject = { 
      name: event.target[0].value,
      number: event.target[1].value
    }

    if (persons.map(p => p.name).includes(nameObject.name)) {
      alert(`${nameObject.name} is already in the phone book`)
      return
    }

    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) =>
    setNewName(event.target.value)

  const handleNumberChange = (event) =>
    setNewNumber(event.target.value)
  
  const handleFilterChange = (event) =>
    setNewFilter(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter value={newFilter} onChange={handleFilterChange} />

      <h3>Add a new number</h3>

      <PersonForm addName={addName}
        name={newName} handleNameChange={handleNameChange}
        number={newNumber} handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons persons={persons} filter={newFilter} />
    </div>
  )

}

export default App