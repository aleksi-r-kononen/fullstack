import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length))

  const setRandom = () => {
    const newSelection = Math.floor(Math.random() * anecdotes.length)
    setSelected(newSelection)
    console.log("selecting random anecdote:", newSelection+1, "/", anecdotes.length)
  }

  const addVote = () => {
    const copy = { ...votes }
    copy[selected] += 1
    setVotes(copy)
    console.log("adding a vote to anecdote", selected+1, ": now", copy[selected], "votes")
  }

  const indexOfMaximum = () => {
    let max = votes[0]
    let maxIndex = 0
    for (let i = 1; i < anecdotes.length; i++) {
      if (votes[i] > max) {
        maxIndex = i
        max = votes[i]
      }
    }

    return maxIndex
  }

  console.log("rendering anecdote", selected+1)
  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <Button handleClick={addVote} text="vote" />
      <Button handleClick={setRandom} text="next anecdote" />
      
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[indexOfMaximum()]}</p>
      <p>has {votes[indexOfMaximum()]} votes</p>
    </div>
  )
}

export default App