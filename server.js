import Koa from 'koa2';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import koaValidator from 'koa2-validator';
import BooksController from './books.controller';
/* region Для генератора данных */
import Generator from './generator';
import {db} from './db';
import {groupMiddleware, sortMiddleware} from "./utils";
/* endregion */

const app = new Koa();
const router = new Router();
const booksController = new BooksController();

/** Генерируем 1ккк записей */
// db::Generator.addBook(1000).then(() => {
//     console.log('data generated');
// });

router
    .get('/books', booksController.getBooks)
    .post('/books', booksController.validate, booksController.addBook)
    .put('/books/:id', booksController.validate, booksController.putBook);

app
    .use(koaValidator())
    .use(bodyParser())
    .use(sortMiddleware)
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(4000, (err) => {
    if (err) {
        return console.error('server could not start')
    }
    console.log('server is running')
});
