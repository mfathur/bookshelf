const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString;
    const updatedAt = insertedAt;
    const finished = (readPage === pageCount) ? true : false;

    if (name) {
        if (pageCount < readPage) {
            const response = h.response({
                status: "fail",
                message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
            });
            response.code(400);
            return response;
        }

        const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt };

        books.push(newBook)

        const isSuccess = books.filter(book => book.id === id).length > 0;

        if(isSuccess){
            const response = h.response({
                status: "success",
                message: "Buku berhasil ditambahkan",
                data: {
                    bookId: id
                }
            });
            response.code(201);
            return response;
        }

    } else {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    }


    const response = h.response({
        status: "error",
        message: "Buku gagal ditambahkan"
    });
    response.code(500);
    return response;
}

const getAllBooksHandler = () => {

}

const getBookByIdHandler = () => {

}

const editBookByIdHandler = () => {

}

const deleteBookByIdHandler = () => {

}

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };