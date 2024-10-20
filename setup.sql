-- reset script
drop database if exists losningsforslag;

-- opprett data
create database if not exists losningsforslag;

-- definer hvilken database resten av skriptet skal kjøre mot
use losningsforslag;

-- opprett tabell for rooms
create table
    rooms (
        id int primary key auto_increment,
        name varchar(50) not null unique,
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

-- insert data to tables, generated with chatGPT
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
    (
        'Future of Technology',
        '10:00:00',
        '11:00:00',
        1,
        1
    ),
    ('AI Innovations', '11:30:00', '12:15:00', 2, 2),
    (
        'Data Science Trends',
        '13:00:00',
        '13:30:00',
        3,
        3
    ),
    (
        'Effective Communication',
        '14:00:00',
        '14:00:00',
        4,
        4
    ),
    (
        'Building Resilient Teams',
        '16:00:00',
        '17:30:00',
        5,
        5
    );

-- opprett triggere for validering av inserts statements

-- ! set delimiter til // isteden for ;. 
-- MySql antart at ; er slutten på hele create trigger statementen og ikke slutten på 
-- en linje inni create trigger body.
delimiter //

-- definer trigger med navn "limit_rooms" skal kjøre før hver insert statement til rooms tabellen for å sjekke antall rom ikke overstiger 7
create trigger limit_rooms before insert on rooms 
for each row begin
    -- trigger body begynner her

    -- definer en variabel som holder på antall rom 
    declare room_count int;
    
    -- hent antall rader i rooms tabellen og put dette inn i room_count variabelen over
    select count(*) into room_count from rooms;

    -- valider antall rom ikke er større eller lik 7
    if room_count >= 7 then
        -- hvis croom_count er 7 eller større send signal sqlstate '45000' tilsvarende throw exception i js.
        signal sqlstate '45000'
            set message_text = 'Cannot insert more than 7 rooms'; 
    end if;
end // -- siden vi har endret delimiter til // så bruker vi // her for å signalisere at dette er slutten på create trigger statementen vår.


create trigger talk_overlapping_time_and_room before insert on talks
for each row begin 
    declare overlapping int;

    -- finn antall talk i talks tabellen som den nye talken har overlappende tid og rom med.
    select count(*) into overlapping from talks 
    where room_id = new.room_id 
    and new.start_time between start_time and end_time;

    -- hvis antall overlappende talks er større enn 0, avbryt insert og kast feilmelding.
    if overlapping > 0 then
        signal sqlstate '45000'
        set message_text = 'Talk is overlapping existing talk in selected room';
    end if;
end // 

delimiter ;
-- reset delimiter tilbake til ;