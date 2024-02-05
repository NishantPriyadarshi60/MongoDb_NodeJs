const express = require("express");
const app = express();
const { connectToDb, getDb } = require('./db')
const { ObjectId } = require('mongodb')
const port = 3000;
app.use(express.json())

connectToDb((err) => {
    if (!err) {
        app.listen(port, () => {
            console.log(`Port is running on ${port}`)
        })
        db = getDb();
    }
})



// cursor and fetching data

app.get("/books", async (req, res) => {
    try {
        const books = await db.collection('books').find({}).sort({ author: 1 }).toArray()
        res.json(books)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Could not fetch the documents" })
    }
})


//  Finding single document

app.get('/books/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
            .findOne({ _id: new ObjectId(req.params.id) })
            .then(doc => {
                res.status(200).json(doc)
            })
            .catch(err => {
                res.status(500).json({ error: "could not fetch the document" })
            })
    } else {
        res.status(500).json({ error: "Not a Valid document" })
    }
})



// Post Request

app.post('/books', (req, res) => {
    const book = req.body

    db.collection('books')
        .insertOne(book)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(error => {
            res.status(500).json({ error: "could not create a new Document" })
        })
})


// Delete request


app.delete('/books/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
            .deleteOne({ _id: new ObjectId(req.params.id) })
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({ error: "could not delete the document" })
            })
    } else {
        res.status(500).json({ error: "Not a Valid document" })
    }
})



// Patch Request (Update method)


app.patch('/books/:id', (req, res) => {
    const updates = req.body
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
            .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates })
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({ error: "could not update the document" })
            })
    } else {
        res.status(500).json({ error: "Not a Valid document" })
    }

})