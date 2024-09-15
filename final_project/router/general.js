const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username} = req.body;
  const {password} = req.body;
    if (!username || !password) {
        return res.status(400).json({message: "Please enter username and password!"})
    }
    if (isValid(username)){
        users.push({"username": username, "password": password})
        return res.status(200).json({message: "User registered successfully!"})
    }else{
        return res.status(400).json({message: "User already exists!"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    return res.status(200).send(JSON.stringify(books, null, 4));
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const {isbn} = req.params;
  if (!isbn) {
    return res.status(400).json({message: "Parameter ISBN required!"})
  }
  const book = books[isbn]
  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({message: "Book not found!"})
  }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(
    book => book.author.toLowerCase() === author.toLowerCase()
)
  if (booksByAuthor.length > 0) {
    return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
  }else {
  return res.status(404).json({message: "Book not found!"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(
    book => book.title.toLowerCase() === title.toLowerCase()
);
  if (booksByTitle.length > 0) {
    return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
  }else {
  return res.status(404).json({message: "Book not found!"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    if (book.reviews) {
        return res.status(200).json(book.reviews);
    }else {
        return res.status(200).json({message: "No review found for this book!"});
    }
   }else {
    return res.status(404).json({message: "Book not found!"});
    }
});

module.exports.general = public_users;
