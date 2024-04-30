import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateLikes, removeBlog, username }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showOnlyIfOwner = { display: blog.user.name === username ? '' : 'none' }
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  return (
    <div style={blogStyle}>
      <div style={showWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(false)}>hide</button>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={() => updateLikes(blog)}>like</button>
        </div>
        <div>{blog.user.name}</div>
        <button
          style={showOnlyIfOwner}
          onClick={() => removeBlog(blog)}>
          remove
        </button>
      </div>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(true)}>view</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateLikes: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
}

export default Blog