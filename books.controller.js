import Controller from './controller';
import {dbConnect} from './db';
import {getValuesByUpdate, getValuesByInsert} from './utils';

export default class BooksController extends Controller {

    /**
     * Список книг
     * @type {Function}
     */
    getBooks = dbConnect(async (conn, ctx) => {
        const {sort} = ctx.query;
        const SQL = `select * from books ${sort} limit ${this.limit} offset ${ctx.query.offset || this.offset}`;
        ctx.body = await conn.query(SQL);
    });

    /**
     * Добавление книги
     * @type {Function}
     */
    addBook = dbConnect(async (conn, ctx) => {
        const SQL = `insert into books ${getValuesByInsert(ctx.request.body)}`;
        await conn.query(SQL);
        ctx.status = 201;
    });

    /**
     * Изменение книги
     * @type {Function}
     */
    putBook = dbConnect(async (conn, ctx) => {
        const SQL = `update books set ${getValuesByUpdate(ctx.request.body)} where id = ${ctx.params.id}`;
        await conn.query(SQL);
        ctx.status = 204;
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
