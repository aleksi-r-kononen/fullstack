import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createNewBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createNewBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input type="text" value={title} name="Title"
          onChange={({ target }) => setTitle(target.value)}
          data-testid='blogFormTitle'
          placeholder='write blog title here'
        />
      </div>
      <div>
        author:
        <input type="text" value={author} name="Author"
          onChange={({ target }) => setAuthor(target.value)}
          data-testid='blogFormAuthor'
          placeholder='write blog author here'
        />
      </div>
      <div>
        url:
        <input type="text" value={url} name="Url"
          onChange={({ target }) => setUrl(target.value)}
          data-testid='blogFormUrl'
          placeholder='write blog url here'
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

BlogForm.propTypes = {
  createNewBlog: PropTypes.func.isRequired
}

export default BlogForm