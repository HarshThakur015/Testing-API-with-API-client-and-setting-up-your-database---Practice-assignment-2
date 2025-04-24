const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const books = require('./data.json');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const saveBooksToFile = () => {
  fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(books, null, 2), 'utf-8');
}

app.get('/books', (req, res) => {
  return res.json(books);
});

app.get('/books/:id', (req, res) => {
  const id = req.params.id;
  const reqBook = books.find(book => book.book_id === id);

  if (!reqBook) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  return res.status(200).json(reqBook);
});

app.post('/books', (req, res) => {
  const { book_id, title, author, genre, year, copies } = req.body;

  if (!book_id || !title || !author || !genre || !year || !copies) {
    return res.status(400).json('Enter all details');
  }

  const AddedBook = { book_id, title, author, genre, year, copies };

  books.push(AddedBook);
  saveBooksToFile();

  return res.status(201).json({
    success: true,
    New_Book: AddedBook,
  });
});

app.put('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.book_id === req.params.id);

  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  const updatedBook = { ...books[bookIndex], ...req.body };
  books[bookIndex] = updatedBook;
  saveBooksToFile();

  res.status(200).json(updatedBook);
});

app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.book_id === req.params.id);

  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  books.splice(bookIndex, 1);
  saveBooksToFile();
  res.status(200).json({ message: 'Book deleted successfully.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
