import Message from './Message'
import { useState } from 'react'

const LoginForm = ({ handleLogin, errorMessage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const callLogin = (event) => {
    event.preventDefault()
    handleLogin({
      username: username,
      password: password
    })

    setUsername('')
    setPassword('')
  }

  return (
    <>
      <h2>Log in to application</h2>
      <Message message={errorMessage} color={'red'} />
      <form onSubmit={callLogin}>
        <div>
          username
          <input type="text" value={username} name="Username"
            onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          password
          <input type="text" value={password} name="Password"
            onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )
}

export default LoginForm