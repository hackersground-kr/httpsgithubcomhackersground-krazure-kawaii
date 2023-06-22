create table categoryEntity
(
    uuid varchar(36) not null
        primary key,
    name varchar(24) not null,
    constraint IDX_1ff5abf5b7b427611d6e6985ec
        unique (name)
);

