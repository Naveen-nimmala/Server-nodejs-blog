import mongoose from 'mongoose';


const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    datetime: String
  });
  
  const Blog =  mongoose.model("Blog", blogSchema)

  export default Blog;