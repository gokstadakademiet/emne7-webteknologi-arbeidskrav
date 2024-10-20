## Løsningsforslag for arbeidskrav

For å kjøre applikajsonen på localhost med mysql server:

1. Opprett en database bruker i mysql server med tilstrekkelige rettigheter

    ```text
    host: localhost
    user: student
    password: Str0ngP@ssw0rd!
    database: losningsforslag
    ```

2. Kjør **setup.sql** scriptet i dbms eller i terminal:

    ```bash
    mysql -h localhost -u student < setup.sql
    ```

    **Tast inn passordet over når etterspurt**

3. Installer dependencies og kjør dev scriptet:

    ```bash
    $ npm i
    $ npm run dev
    ```

4. Importer **arbeidskrav_losningsforslag.postman_collection.json** i postman og test at alt funker.
