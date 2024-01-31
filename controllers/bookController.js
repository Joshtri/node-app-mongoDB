const Book = require('../models/Book');
const mongoose = require('mongoose');
// const path = require('path');
// const fs = require('fs').promises;



exports.bookPageView = async (req,res) =>{
    const locals = {
        title: 'Data Book',
        description: 'Data Book of IS Selling'
    }

    let perPage = 12;
    let page = req.query.page || 1;


    try {
        const books = await Book.aggregate([{ $sort: { createdAt: -1 } }])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();    

        // Count is deprecated. Use countDocuments({}) or estimatedDocumentCount()
        // const count = await Customer.count();
        const count = await Book.countDocuments({});

        const message = await req.flash('info');
        const message_edit = await req.flash('editInfo')
        res.render('data_book',{
            locals,
            message,
            message_edit,
            books,
            current : page,
            pages: Math.ceil(count / perPage),
        });
    } catch (error) {
        console.log(error);
    }
}

exports.addBook = async (req,res)=>{
    res.render('add_book');
}

exports.postBook = async (req,res)=>{

    // console.log(req.body);

    const newBook= new Book({
        title_book: req.body.title_book,
        author: req.body.author,
        publisher: req.body.publisher,
        publication_year: req.body.publication_year,
        number_of_page: req.body.number_of_page,
        book_description : req.body.book_description,
        // createdAt:req.body.createdAt
        book_pdf : req.body.book_pdf
    });

    if (req.file) {
        newBook.cover_book = req.file.path; // Update to use 'book_cover'
    }

    try {
        await Book.create(newBook);
        // res.render('add_customer');

        await req.flash('info', 'Buku baru telah ditambahkan.');
        res.redirect('/data_book'); //back to data_book.
    } catch (error) {
        console.log(error);
    }
}

exports.detailBook = async (req,res)=>{

    const locals = {
        title : "Detail Book",
        description : "",
    }
    try {

        const book = await Book.findOne({_id:req.params.id})
        res.render('detail_book',{
            book,
            locals
        })
    } catch (error) {
        
    }
}


/*
GET VIEW PAGE EDIT BOOK.
*/
exports.editBook = async (req, res) => {
    const locals = {
        title: "Edit Book",
        description: "Edit Book in IS Selling"
    };

    try {
        const book = await Book.findOne({ _id: req.params.id });

        if (book) {
            res.render('edit_book', {
                book,
                locals
            });
        } else {
            // Handle the case where the book is not found
            res.status(404).send('Book not found');
        }
    } catch (error) {
        // Handle other errors
        console.error('Error fetching book:', error);
        res.status(500).send('Internal Server Error');
    }
};



/*
POST DATA EDIT BOOK.
*/


exports.postEditBook = async(req,res)=>{
    try {
        await Book.findOneAndUpdate({
            title_book :  req.body.title_book,
            author : req.body.author,  
            publisher : req.body.publisher, 
            publication_year : req.body.publication_year,
            number_of_page : req.body.number_of_page
        }).where(req.params.id);


        await req.flash('editInfo', 'Update data buku berhasil !')

        res.redirect('/data_book');
    } catch (error) {
        console.log(error);
    }
};

/*
DELETE DATA EDIT BOOK.
*/


exports.postDeleteBook = async (req, res) => {
    try {
        await Book.deleteOne({_id:req.params.id});



        await req.flash('deleteInfo', 'Data buku berhasil di hapus')
        res.redirect('/data_book')

    } catch (error) {
        console.log(error);
    }
};

