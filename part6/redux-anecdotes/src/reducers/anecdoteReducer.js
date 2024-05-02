import { createSlice } from "@reduxjs/toolkit"

const anecdoteSlice = createSlice({ /* airbending slice! -sokka */
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    voteAnecdote(state, action) {
      const id = action.payload
      const selectedAnecdote = state.find(obj => obj.id === id)
      const updatedAnecdote = { ...selectedAnecdote, votes: selectedAnecdote.votes + 1 }
      return state
        .map(obj => obj.id === id ? updatedAnecdote : obj)
        .sort((a, b) => b.votes - a.votes)
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
      return state.sort((a, b) => b.votes - a.votes)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  },
})

export const { createAnecdote, voteAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer