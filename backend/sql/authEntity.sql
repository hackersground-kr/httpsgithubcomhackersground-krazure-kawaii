create table authEntity
(
    uuid         varchar(36)                               not null
        primary key,
    email        varchar(60)                               not null,
    password     text                                      not null,
    salt         varchar(64)                               not null,
    nickname     varchar(24)                               not null,
    gender       char                                      not null,
    birth        timestamp                                 not null,
    role         varchar(7)                                not null,
    profileImage text                                      null,
    createdAt    timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    constraint IDX_5044a9af778ca166e0c36b6c0c
        unique (nickname),
    constraint IDX_6854115ab58164bb43b05c0b6c
        unique (email)
);

