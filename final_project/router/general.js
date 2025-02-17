const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Base URL for the book API
const BASE_URL = 'http://localhost:5001';

// Original code: Get the list of books available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json({ books });
});

// Original code: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({ book: books[isbn] });
});

// Original code: Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    const booksByAuthor = Object.values(books).filter((book) => book.author === author);

    if (booksByAuthor.length === 0) {
        return res.status(404).json({ message: "No books found by this author" });
    }

    return res.status(200).json({ books: booksByAuthor });
});

// Original code: Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    const booksByTitle = Object.values(books).filter((book) => book.title === title);

    if (booksByTitle.length === 0) {
        return res.status(404).json({ message: "No books found with this title" });
    }

    return res.status(200).json({ books: booksByTitle });
});

// Original code: Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews || Object.keys(books[isbn].reviews).length === 0) {
        return res.status(404).json({ message: "No reviews found for this book" });
    }

    return res.status(200).json({ reviews: books[isbn].reviews });
});

// New code: Get the list of available books using promise callbacks
public_users.get('/books', (req, res) => {
    axios.get(`${BASE_URL}/`)
        .then((response) => {
            res.status(200).json({ books: response.data.books });
        })
        .catch((error) => {
            res.status(500).json({ message: "Failed to fetch books", error: error.message });
        });
});

// New code: Get book details based on ISBN using promise callbacks
public_users.get('/books/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    axios.get(`${BASE_URL}/isbn/${isbn}`)
        .then((response) => {
            res.status(200).json({ book: response.data.book });
        })
        .catch((error) => {
            res.status(500).json({ message: "Failed to fetch book details", error: error.message });
        });
});

// New code: Get book details based on Author using promise callbacks
public_users.get('/books/author/:author', (req, res) => {
    const author = req.params.author;

    axios.get(`${BASE_URL}/author/${author}`)
        .then((response) => {
            res.status(200).json({ books: response.data.books });
        })
        .catch((error) => {
            res.status(500).json({ message: "Failed to fetch books by author", error: error.message });
        });
});

// New code: Get book details based on Title using promise callbacks
public_users.get('/books/title/:title', (req, res) => {
    const title = req.params.title;

    axios.get(`${BASE_URL}/title/${title}`)
        .then((response) => {
            res.status(200).json({ books: response.data.books });
        })
        .catch((error) => {
            res.status(500).json({ message: "Failed to fetch books by title", error: error.message });
        });
});

module.exports.general = public_users;