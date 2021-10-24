# run for mariaDB

create or replace table items
(
    id         int auto_increment
        primary key,
    `name`       varchar(100) not null,
    quantity   int          not null,
    user_id    int          not null,
    expires_at timestamp    null
);

create or replace index user_id_name_index
    on items (user_id, name);

create or replace table users
(
    id       int auto_increment
        primary key,
    name     varchar(80)  not null,
    username varchar(30)  not null,
    password varchar(200) not null,
    constraint unique_username
        unique (username)
);

