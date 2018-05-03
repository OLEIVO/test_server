import faker from 'faker2';
import moment from 'moment';
import momentRandom from 'moment-random';
import {conConfig} from "./db";

export default class Generator {

    /**
     * Добавление книг
     * @param count - количество книг, которое необходимо сгенерировать
     * @return {Promise<void>}
     */
    static async addBook(count = 1) {
        try {
            const connect = await this.connect(conConfig);
            for (let idx = 0; idx < count; idx++) {
                const randomDate = momentRandom(moment('2018-12-31'), moment('2014-01-01'));
                const sql = `insert into books (book_title, book_date, book_author, book_desc) values ("${faker.Lorem.sentence(1)}", "${randomDate.format("YYYY-MM-DD")}", "${faker.Name.firstName()}", "${faker.Lorem.sentence(1)}")`;
                await connect.query(sql);
            }
        } catch (err) {
            throw err;
        }
    };
}