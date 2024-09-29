-- reset script
drop database if exists losningforslag;

-- opprett data
create database if not exists losningforslag;

-- definer hvilken database resten av skriptet skal kjøre mot
use losningforslag;

-- opprett tabell for rooms
create table
    rooms (
        id int primary key auto_increment,
        name varchar(20) not null unique,
        capacity int not null
    );

-- opprett tabell for speakers
create table
    speakers (
        id int primary key auto_increment,
        name varchar(50) not null unique,
        email varchar(50),
        company VARCHAR(50)
    );

-- opprett table for talks
create table
    talks (
        id int primary key auto_increment,
        title varchar(30) not null unique,
        start_time time not null,
        end_time time not null,
        room_id int not null,
        speaker_id int not null,
        foreign key (room_id) references rooms (id) on delete cascade,
        foreign key (speaker_id) references speakers (id) on delete cascade 
    );

-- insert data to tables
insert into
    rooms (name, capacity)
values
    ('Conference Hall', 100),
    ('Meeting Room A', 20),
    ('Training Room', 50),
    ('Executive Suite', 10),
    ('Workshop Space', 30);

insert into
    speakers (name, email, company)
values
    (
        'Olivia Smith',
        'olivia.smith@example.com',
        'InnovateX'
    ),
    ('Noah Brown', 'noah.brown@example.com', 'NextGen'),
    (
        'Emma Williams',
        'emma.williams@example.com',
        'NextGen'
    ),
    ('Ava Smith', 'ava.smith@example.com', 'InnovateX'),
    ('Emma Brown', 'emma.brown@example.com', 'BlueSky');

insert into
    talks (title, start_time, end_time, room_id, speaker_id)
values
    ('Future of Technology', '10:00:00', '11:00:00', 1, 1),
    ('AI Innovations', '11:30:00', '12:15:00', 2, 2),
    ('Data Science Trends', '13:00:00', '13:30:00', 3, 3),
    ('Effective Communication', '14:00:00', '14:00:00', 4, 4),
    ('Building Resilient Teams', '16:00:00', '17:30:00', 5, 5)
;

select * from speakers;


