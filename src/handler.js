const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
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

        if (isSuccess) {
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

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    const response = { status: "success", data: {} };
    let queriedBooks = [];
    queriedBooks = books;

    if (Object.keys(request.query).length !== 0) {
        if (name) {
            queriedBooks = queriedBooks.filter(book => book.name.toLowerCase().includes(name.toLowerCase()));
        }

        if (reading) {
            if (reading === 0) {
                queriedBooks = queriedBooks.filter(book => book.reading === false);
            } else {
                queriedBooks = queriedBooks.filter(book => book.reading === true);
            }
        }

        if (finished) {
            if (finished === 0) {
                queriedBooks = queriedBooks.filter(book => book.finished === false);
            } else {
                queriedBooks = queriedBooks.filter(book => book.finished === true);
            }
        }

    }

    response.data = {
        books: queriedBooks.map(book => {
            return {
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }
        })
    };
    return response;
}

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.find(b => b.id === bookId);

    if (book !== undefined) {
        return h.response({
            status: "success",
            data: {
                book: book
            }
        }).code(200);
    }
    const response = h.response({
        status: "fail",
        message: "Buku tidak ditemukan"
    });
    response.code(404);
    return response;
}

const editBookByIdHandler = (request, h) => {
    try {
        const { bookId } = request.params;
        const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

        if (readPage > pageCount) {
            const response = h.response({
                status: "fail",
                message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
            }).code(400);

            return response;
        }

        const index = books.findIndex((book) => book.id === bookId);
        const updatedAt = new Date().toISOString();
        if (index !== -1) {

            if (name) {
                books[index] = {
                    ...books[index],
                    name,
                    readPage,
                    year,
                    author,
                    summary,
                    publisher,
                    pageCount,
                    reading,
                    updatedAt
                };

                const response = h.response({
                    "status": "success",
                    "message": "Buku berhasil diperbarui"
                }).code(200);

                return response;
            }

            const response = h.response({
                status: "fail",
                message: "Gagal memperbarui buku. Mohon isi nama buku"
            }).code(400);
            return response;
        }

        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan"
        }).code(404);
        return response;
    } catch (e) {
        console.log(e);
    }

}

const deleteBookByIdHandler = (request, h) => {
    try {
        const { bookId } = request.params;

        const index = books.findIndex((book) => book.id == bookId);

        if (index !== -1) {
            books.splice(index, 1);
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil dihapus'
            });
            response.code(200);
            return response;
        }

        const response = h.response({
            status: "fail",
            message: "Buku gagal dihapus. Id tidak ditemukan"
        }).code(404);
        return response;
    } catch (e) {
        console.log(e);
    }
}

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };
