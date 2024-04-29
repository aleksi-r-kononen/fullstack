const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (!blogs)
    return 0
  
  return blogs.reduce((sum, cur) => sum + cur.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (!blogs)
    return { title: "no-blogs-found", author: "no-blogs-found", likes: 0 }

  
  const maxLikes = Math.max(...blogs.map(b => b.likes))
  const favorite = blogs.find(b => b.likes === maxLikes)
  return { title: favorite.title, author: favorite.author, likes: favorite.likes }
}

const mostBlogs = (blogs) => {
  if (!blogs)
    return { author: "no-blogs-found", blogs: 0 }

  /* counts will form of key-value pairs "author-name": numberOfBlogs */
  const counts = {}
  blogs.forEach(b => {
    /* if defined, increment by 1, otherwise initialize as 1 */
    counts[b.author] = counts[b.author] ? counts[b.author] + 1 : 1
  })

  /* horrible O(n^2) time complexity for the same solution*/
  /*
    blogs.map(b => b.author).forEach(a => {
      if (Object.keys(counts).includes(a)) {
        counts[a] += 1
      } else {
        counts[a] = 1
      }
    })
  */

  /* get the largest numberOfBlogs and then find an author with that number */
  /* could single-pass to obtain both at once but this works */
  const mostBlogs = Math.max(...Object.values(counts))
  const mostAuthor = Object.keys(counts).find(a => counts[a] === mostBlogs)
  return { author: mostAuthor, blogs: mostBlogs }
}

const mostLikes = (blogs) => {
  if (!blogs)
    return { author: "no-blogs-found", likes: 0 }

  /* logic equivalent to mostBlogs */

  const counts = {}
  blogs.forEach(b => {
    counts[b.author] = counts[b.author] ? counts[b.author] + b.likes : b.likes
  })

  const mostLikes = Math.max(...Object.values(counts))
  const mostAuthor = Object.keys(counts).find(a => counts[a] === mostLikes)
  return { author: mostAuthor, likes: mostLikes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}