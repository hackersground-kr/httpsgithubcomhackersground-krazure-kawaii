create table registEntity
(
    uuid        varchar(36) not null
        primary key,
    lectureUUID varchar(36) null,
    author      varchar(36) null,
    constraint FK_571772d5022c15b218d79438e20
        foreign key (author) references authentity (uuid)
            on update cascade on delete cascade,
    constraint FK_5ea5add3feebabda80c76808653
        foreign key (lectureUUID) references lectureentity (uuid)
            on update cascade on delete cascade
);

