create table lectureEntity
(
    uuid         varchar(36)   not null
        primary key,
    title        varchar(50)   not null,
    description  text          not null,
    location     longtext      null,
    startTime    timestamp     not null,
    endTime      timestamp     not null,
    price        int default 0 not null,
    capacity     int default 0 not null,
    bannerImage  text          not null,
    type         varchar(7)    not null,
    categoryUUID varchar(36)   null,
    teacherUUID  varchar(36)   null,
    constraint FK_080c8b19ba1018bcb2be69274b5
        foreign key (categoryUUID) references categoryentity (uuid)
            on update cascade on delete cascade,
    constraint FK_a8ba68f08755871c4b87636050e
        foreign key (teacherUUID) references authentity (uuid)
            on update cascade on delete cascade
);

