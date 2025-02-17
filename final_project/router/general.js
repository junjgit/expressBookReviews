const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!isValid(username)) {
        return res.status(400).json({ message: "Invalid username" });
    }

    if (users.some((user) => user.username === username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    users.push({ username, password });

    return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({ book: books[isbn] });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const { author } = req.params;

    const booksByAuthor = Object.values(books).filter((book) => book.author === author);

    if (booksByAuthor.length === 0) {
        return res.status(404).json({ message: "No books found by this author" });
    }

    return res.status(200).json({ books: booksByAuthor });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const { title } = req.params;

    const booksByTitle = Object.values(books).filter((book) => book.title === title);

    if (booksByTitle.length === 0) {
        return res.status(404).json({ message: "No books found with this title" });
    }

    return res.status(200).json({ books: booksByTitle });
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews || Object.keys(books[isbn].reviews).length === 0) {
        return res.status(404).json({ message: "No reviews found for this book" });
    }

    return res.status(200).json({ reviews: books[isbn].reviews });
});

module.exports.general = public_users;