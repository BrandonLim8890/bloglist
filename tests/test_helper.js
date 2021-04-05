const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'How to blog',
    author: 'Dondon',
    url: 'http://facebook.com/william.ok.5',
    likes: 6,
  },
  {
    title: 'Intial test',
    author: 'Brandon Lim',
    url: 'http://localhost/thisisatest',
    likes: 32
  }
]

const newBlog = {
  title: 'CSGO vs Valorant',
  author: 'Isaac Han',
  url: 'facebook.com/william.ok.5.123123123asd',
  likes: 9
}
const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
} 
  
const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremove', author: 'removethissoon', url: 'willremove', likes: 0 })
  await blog.save()
  await blog.delete()

  return blog.id
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDB, newBlog
}