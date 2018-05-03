-- auto-generated definition
create table books
(
  id int(11) NOT NULL AUTO_INCREMENT,
  book_title varchar(128) not null,
  book_date  date         null,
  book_author varchar(64)  not null,
  book_desc  varchar(255) null,
  book_image blob         null,
  UNIQUE KEY books_id (id, book_date)
);


ALTER TABLE books PARTITION BY RANGE ( YEAR(book_date) ) (
PARTITION books_2014 VALUES LESS THAN (2014),
PARTITION books_2015 VALUES LESS THAN (2015),
PARTITION books_2016 VALUES LESS THAN (2016),
PARTITION books_2017 VALUES LESS THAN (2017),
PARTITION books_2018 VALUES LESS THAN (2018)
);

SELECT * FROM books PARTITION (books_2016);