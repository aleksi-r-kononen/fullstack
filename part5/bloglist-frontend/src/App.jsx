import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Message from './components/Message'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (usernamepassword) => {
    try {
      const user = await loginService.login(usernamepassword)

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)

      setSuccessMessage(`logged in as ${user.username}`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const createNewBlog = async (blog) => {
    try {
      const newBlog = await blogService.create(blog)
      setBlogs(blogs.concat(newBlog))
      blogFormRef.current.toggleVisibility()

      setSuccessMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch(exception) {
      setErrorMessage('blog title or url missing')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const updateLikes = async (blog) => {
    try {
      const newBlog = await blogService.update(blog.id, { ...blog, likes: blog.likes + 1 })
      setSuccessMessage(`liked ${newBlog.title} by ${newBlog.author}`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)

      setBlogs(blogs.map(b => b.id === blog.id ? { ...blog, likes: blog.likes + 1 } : b))
    } catch (exception) {
      console.log(exception)
      setErrorMessage('failed to update blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const removeBlog = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`))
      return

    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      setSuccessMessage(`removed ${blog.title} by ${blog.author}`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      console.log(exception)
      setErrorMessage('cannot remove blogs by other users')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <LoginForm handleLogin={handleLogin} errorMessage={errorMessage} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Message message={successMessage} color={'green'} />
      <Message message={errorMessage} color={'red'} />
      <div>
        {user.name} logged in
        <button onClick={() => {
          window.localStorage.removeItem('loggedBlogappUser')
          setUser(null)
        }}>
          logout
        </button>
      </div>
      <h2>create new</h2>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createNewBlog={createNewBlog} />
      </Togglable>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog}
          updateLikes={updateLikes}
          removeBlog={removeBlog}
          username={user.name}
        />
      )}
    </div>
  )
}

export default App