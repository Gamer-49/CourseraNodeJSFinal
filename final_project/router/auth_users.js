const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;
  if(!username || !password){
    return res.status(400).json({message: "username and password required"});
  }
  if(authenticatedUser(username, password)){
    const token = jwt.sign({username: username}, "secret", {expiresIn: "1h"});
    req.session.authorization ={
      token,
      username,
    };
    return res.status(200).json({message: "user logged in successfully"]);
  }else{
    return res.status(401).json({message: "Invalid login credentials"});
  }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;
  if(!username){
    return res.status(401).json({message: " User not logged in"});
  }
  if(!books[isbn]){
    return res.status(404).json({message: "Book not found"});
  }
  books[isbn].reviews[username] = review;
  return res.status(200).json({message: "Review added/modified successfully"});

});

//delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;
  if(!username){
    return res.status(401).json({message: User not logged in"});
  }
  if(!books[isbn]){
      return res.status(404).json({message: "Book not found"});
  }
  const bookReviews = books[isbn].reviews;
  if(bookReviews[username]){
    delete bookReviews[username];
    return res.status(200).json({message: "Review deleted successfully"});
 }else{
    return res.status(404).json({message: "Review not found for this user"});
}); 
 
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
