import Koa from 'koa2';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import koaValidator from 'koa2-validator';
import koaQS from 'koa-qs';
import cache from 'koa-redis-cache';
import {sortMiddleware} from './middlewares';
import BooksController from './books.controller';
/* region Для генератора данных */
import Generator from './generator';
import {db} from './db';
/* endregion */

const port = process.env.PORT || 3000;

const app = new Koa();
const router = new Router();
const booksController = new BooksController();

const optionsCache = {
    expire: 10,
    routes: ['/books']
};

/** Генерируем 1ккк записей */
// db::Generator.addBook(1000).then(() => {
//     console.log('data generated');
// });

router
    .get('/books', booksController.getBooks)
    .post('/books', booksController.validate, booksController.addBook)
    .put('/books/:id', booksController.validate, booksController.putBook);

koaQS(app, 'strict');

app
    .use(cache(optionsCache))
    .use(koaValidator())
    .use(bodyParser())
    .use(sortMiddleware)
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(port, (err) => {
    if (err) {
        return console.error('server could not start')
    }
    console.log(`server is running and listen ${port}`)
});
