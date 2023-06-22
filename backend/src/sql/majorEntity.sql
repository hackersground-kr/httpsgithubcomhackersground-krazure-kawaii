create table majorEntity
(
    uuid          varchar(36)       not null
        primary key,
    status        tinyint default 0 not null,
    major         varchar(32)       not null,
    certificate   text              not null,
    certificateIn text              not null,
    author        varchar(36)       null,
    constraint FK_79110e5cde2caf0b0d6c399c1c2
        foreign key (author) references authentity (uuid)
            on update cascade on delete cascade
);

