import Controller from './controller';
import {dbConnect} from './db';
import {sorted} from './utils';

export default class BooksController extends Controller {

    /**
     * Список книг
     * @type {Function}
     */
    getBooks = dbConnect(async (conn, ctx) => {

        const {sort, group} = ctx.query;

        const SQL = `select * from books ${group} ${sort} limit ${this.limit} offset ${ctx.query.offset || this.offset}`;
        ctx.body = await conn.query(SQL);
    });

    /**
     * Добавление книги
     * @type {Function}
     */
    addBook = dbConnect(async (conn, ctx) => {
        const {book_title, book_date, book_author, book_desc} = ctx.request.body;
        const SQL = `insert into books (book_title, book_date, book_autor, book_desc) values ("${book_title}", "${book_date}", "${book_author}", "${book_desc}")`;
        await conn.query(SQL);
        ctx.status = 201; // Создаем запись
    });

    /**
     * Изменение книги
     * @type {Function}
     */
    putBook = dbConnect(async (conn, ctx) => {
        const {book_title, book_date, book_author, book_desc} = ctx.request.body;
        const SQL = `update books set book_title = "${book_title}", book_date = "${book_date}", book_autor = "${book_author}", book_desc = "${book_desc}" where id = ${ctx.params.id}`;
        await conn.query(SQL);
        ctx.status = 204; // Не возвращаем контент
    });

    validate = async (ctx, next) => {
        ctx.checkBody('book_title', 'Invalid book title').notEmpty();
        ctx.checkBody('book_date', 'Invalid book date').notEmpty().isDate();
        ctx.checkBody('book_author', 'Invalid book author name').notEmpty();
        ctx.checkBody('book_desc', 'Invalid book description').notEmpty();
        const res = await ctx.getValidationResult();
        (res.array().length) ? ctx.throw(400) : await next();
    };
};
