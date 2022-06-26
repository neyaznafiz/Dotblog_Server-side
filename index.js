const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000

// middlewar
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ynlrp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const allBlogsCollection = client.db("dotblog-data-collection").collection("all-blogs");

        //api for get all blogs
        app.get('/blogs', async (req, res) => {
            const getAllBlogs = await allBlogsCollection.find({}).toArray()
            res.send(getAllBlogs)
        })

        //api for get blog by id
        app.get('/blog/:id', async (req, res) => {
            const getSingleBlogById = await allBlogsCollection.findOne({ _id: ObjectId(req.params.id) })
            res.send(getSingleBlogById)
        })

        //api for blog post
        app.post('/post-blog', async (req, res) => {
            const postBlog = await allBlogsCollection.insertOne(req.body)
            res.send(postBlog)
        })

        //api for delete specific blog
        app.delete('/delete-blog/:id', async (req, res) => {
            const deleteSpecificBlog = await allBlogsCollection.deleteOne({ _id: ObjectId(req.params.id) })
            res.send(deleteSpecificBlog)
        })


    }
    finally { }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hey! I am running')
})


app.listen(port, () => {
    console.log('Listning to port', port)
})