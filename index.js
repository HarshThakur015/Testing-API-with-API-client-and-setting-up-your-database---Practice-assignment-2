const express = require('express');
const bodyParser = require('body-parser');
const books = require('./data.json')
require('dotenv').config()

const app = express();
app.use(bodyParser.json());

// let books = data


//get request -> To retrieve the data of all books

app.get('/books', (req,res)=>{
  return res.json(books)
})

//get request -> to retrieve the data of a particular book by id

app.get('/books/:id', (req,res)=>{
  const id = (req.params.id)
  const reqBook = books.find(book=> book.book_id === id)

  if (!reqBook) {
    return res.status(404).json({ error: 'Book not found.' });
}

  return res.status(200).json(reqBook)
})

//post requiest -> to add new data to the data.json file

app.post('/books', (req,res)=>{

  const {book_id, title, author, genre, year, copies} = req.body

  if(!book_id || !title || !author || !genre || !year || !copies){
    return res.status(400).json('Enter all details')
  }

  const AddedBook = {book_id, title, author, genre, year, copies}

  books.push(AddedBook);



  return res.status(201).json({
    success: true,
    New_Book: AddedBook,
  })

})

//put request -> to update the existing data

app.put('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.book_id === req.params.id);

  if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found.' });
  }

  const updatedBook = { ...books[bookIndex], ...req.body };
  books[bookIndex] = updatedBook;

  res.status(200).json(updatedBook);
});

// delete request -> delete a book data by id
app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.book_id === req.params.id);

  if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found.' });
  }

  books.splice(bookIndex, 1);
  res.status(200).json({ message: 'Book deleted successfully.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})