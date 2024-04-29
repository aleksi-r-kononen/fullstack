const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('there are six blogs and they are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogs = await helper.blogsInDb()
  assert.strictEqual(blogs.length, 6)
})

test('blog identifying field is .id', async () => {
  /* i.e. check that field .id is defined for each blog */
  const blogs = await helper.blogsInDb()
  assert(blogs.map(b => b.id).every(id => id))
})

test('a blog can be added', async () => {
  const newBlog = {
    title: "How To Tame A Mockingbird",
    author: "Mr. Muster Sr.",
    url: "this-is-a-totally-valid-url.url.com.fi.org",
    likes: 77000,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogs = await helper.blogsInDb()
  assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
  assert(blogs.map(b => b.title).includes(newBlog.title))
  assert.strictEqual(blogs.find(b => b.title === newBlog.title).likes, newBlog.likes)
})

test('undefined likes are initialized as zero', async () => {
  const newBlog = {
    title: "How To Tame A Mockingbird",
    author: "Mr. Muster Sr.",
    url: "this-is-a-totally-valid-url.url.com.fi.org",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogs = await helper.blogsInDb()
  const addedBlog = blogs.find(b => b.title === newBlog.title)
  assert(addedBlog.likes === 0)
})

test('blogs missing title or url return 400', async () => {
  const newBlog = {
    title: "How To Tame A Mockingbird",
    author: "Mr. Muster Sr.",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  
  const newerBlog = {
    author: "Mr. Muster Sr.",
    url: "this-is-a-totally-valid-url.url.com.fi.org",
  }

  await api
    .post('/api/blogs')
    .send(newerBlog)
    .expect(400)
})

test('blog deletion succeeds with valid id', async () => {
  const blogs = await helper.blogsInDb()
  const blogToDelete = blogs[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
  
  const remainingBlogs = await helper.blogsInDb()
  assert.strictEqual(remainingBlogs.length, blogs.length - 1)
  assert(!remainingBlogs.map(b => b.title).includes(blogToDelete.title))
})

test('existing blog with valid id can be updated', async () => {
  const blogs = await helper.blogsInDb()
  const blogToUpdate = blogs[0]

  const updatedBlog = { ...blogToUpdate, url: "new-url.com.fi.org.net", likes: 9001 }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const updatedBlogs = await helper.blogsInDb()
  assert.strictEqual(updatedBlogs.length, blogs.length)
  assert.strictEqual(updatedBlogs[0].likes, updatedBlog.likes)
  assert.strictEqual(updatedBlogs[0].url, updatedBlog.url)
  assert(updatedBlogs[0].likes !== blogs[0].likes)
  assert(updatedBlogs[0].url !== blogs[0].url)
})

after(async () => {
  await mongoose.connection.close()
})