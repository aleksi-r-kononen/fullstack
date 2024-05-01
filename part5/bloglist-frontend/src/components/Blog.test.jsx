import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { beforeEach, describe, expect, test } from 'vitest'

describe('<Blog />', () => {
  let container
  let mockHandler
  const blog = {
    title: 'test-blog',
    author: 'test-author',
    url: 'test-url',
    user: { name: 'test-username' }
  }

  beforeEach(() => {
    mockHandler = vi.fn()
    container = render(
      <Blog blog={blog}
        updateLikes={mockHandler}
        removeBlog={mockHandler}
        username='mock-username'
      />
    ).container
  })

  test('renders by default title and author but not url or likes', () => {
    const showDiv = screen.queryByTestId('blogShow')
    expect(showDiv).toBeVisible()
    expect(showDiv).toHaveTextContent('test-blog')
    expect(showDiv).toHaveTextContent('test-author')
    const hideDiv = screen.queryByTestId('blogHide')
    expect(hideDiv).not.toBeVisible()
  })

  test('renders url, likes and user when the show-button has been clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const showDiv = screen.queryByTestId('blogShow')
    expect(showDiv).not.toBeVisible()
    const hideDiv = screen.queryByTestId('blogHide')
    expect(hideDiv).toBeVisible()
    expect(hideDiv).toHaveTextContent('test-blog')
    expect(hideDiv).toHaveTextContent('test-author')
    expect(hideDiv).toHaveTextContent('test-url')
    expect(hideDiv).toHaveTextContent('likes')
    expect(hideDiv).toHaveTextContent('test-user')
  })

  test('updates likes appropriately when the like button is pressed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(1)
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})