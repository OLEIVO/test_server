import mysql from 'async-mysql';

export const conConfig = {
    user: 'aivanov',
    password: 'password',
    database: 'books'
};

export const db = mysql;

/**
 * Декоратор для работы с базой данных
 * @param originFunc - функция содержащая запросы к базе данных
 * @return {Function}
 */
export const dbConnect = originFunc => async (...args) => {
    try {
        const conn = await db.connect(conConfig);
        await originFunc.apply(originFunc, [conn, ...args]);
    } catch (err) {
        throw err;
    }
};
