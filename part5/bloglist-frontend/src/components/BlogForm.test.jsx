import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { describe, expect, test } from 'vitest'

describe('<BlogForm />', () => {
  test('calls the callback function with the correct parameters when submitted', async () => {
    const createBlog = vi.fn()
    render(<BlogForm createNewBlog={createBlog} />)

    const titleBox = screen.queryByTestId('blogFormTitle')
    const authorBox = screen.queryByTestId('blogFormAuthor')
    const urlBox = screen.queryByTestId('blogFormUrl')
    const submitButton = screen.getByText('create')

    await userEvent.type(titleBox, 'usertitle')
    await userEvent.type(authorBox, 'userauthor')
    await userEvent.type(urlBox, 'userurl')
    await userEvent.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('usertitle')
    expect(createBlog.mock.calls[0][0].author).toBe('userauthor')
    expect(createBlog.mock.calls[0][0].url).toBe('userurl')
  })
})