const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => sum + blog.likes
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
  const blogLikes = blogs.map(blog => blog.likes)
  let popularBlogIndex = blogLikes.indexOf(Math.max(...blogLikes))
  return blogs.length === 0 ? null : blogs[popularBlogIndex]
}

const mostBlogs = (blogs) => {
  // Get each author, and the number of number of blogs
  const authors = _.countBy(blogs, 'author')
  // Go through the list of authors, and gets the one with the highest # of blogs
  const topAuthor = _.maxBy(Object.keys(authors), (author) => authors[author])
  // Checks # of blogs the top author has
  const topAuthorBlogs = authors[topAuthor]
  return blogs.length === 0 ? null : {
    author: topAuthor,
    blogs: topAuthorBlogs
  }
}

const mostLikes = (blogs) => {
  // Object of authors grouped with their blogs
  const authors = _.groupBy(blogs, (blog) => blog.author)
  const authorsLikes = _.map(authors, (authorList) => {
    return {
      author: authorList[0].author,
      likes: authorList.reduce((sum, blog) => sum + blog.likes, 0)
    }
  })
  const result = _.maxBy(authorsLikes, author => author.likes)

  return blogs.length === 0 ? null : result
}


module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}