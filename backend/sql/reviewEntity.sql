create table reviewEntity
(
    uuid        varchar(36)                              not null
        primary key,
    star        int         default 0                    not null,
    title       varchar(60)                              not null,
    content     longtext                                 not null,
    createdAt   datetime(6) default CURRENT_TIMESTAMP(6) not null,
    author      varchar(36)                              null,
    lectureUUID varchar(36)                              null,
    constraint FK_57a7257dfde2c5384b6abc7c2d7
        foreign key (author) references authentity (uuid),
    constraint FK_8b7ae860ea15ec2217bfe1b114f
        foreign key (lectureUUID) references lectureentity (uuid)
);

