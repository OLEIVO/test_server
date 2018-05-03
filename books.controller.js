import Controller from './controller';
import {dbConnect} from './db';
import _ from 'lodash';
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
    patchBook = dbConnect(async (conn, ctx) => {
        const SQL = `update books set ${getValuesByUpdate(ctx.request.body)} where id = ${ctx.params.id}`;
        await conn.query(SQL);
        ctx.status = 204;
    });

    puthBook = dbConnect(async (conn, ctx) => {
        let data = await conn.query('select * from books where id = ' + ctx.params.id);
        if (data) {
            data = _.defaults(ctx.request.body, data[0]);
            delete data.id;

            await Promise.all([
                conn.query('delete from books where id = ' + ctx.params.id),
                conn.query(`insert into books ${getValuesByInsert(data)}`),
            ]);
            ctx.status = 204;
        } else {
            ctx.status = 404;
        }
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
