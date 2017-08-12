# GraphQL Guru Sequelize
Sequelize database resolver modules for GraphQL Guru.

It supports the dialects PostgreSQL, MySQL, SQLite and MSSQL 

## Installation
1) In a terminal run `npm install graphql-guru-sequelize`

2) In environment.js add the path to the json storage file and optionally add defaults to seed the database on creation.

    server/environment.js
```
    database: {
      sequelize: {
        username: 'username',
        databases: 'database',
        port: '5432',
        dialect: 'sqlite', // one of 'mysql'|'sqlite'|'postgres'|'mssql',
        host: 'localhost',
        pool: {
          max: 5,
          min: 0,
          idle: 10000
        }
      },
      // SQLite only
      storage: 'path/to/sqlite/database'
    }
```

3) In index-database.js import graphql-guru-sequelize and add it to the database object.

    server/core/database/index-database.js
```
    import * as sequelize from 'graphql-guru-sequelize';

    export const databases = {
      sequelize
    };

```

4) extend resolverQuery and resolverMutation with SequelizeQuery and SequelizeMutation respectively.

    server/modules/resolverQuery.js
    ```
    import { SequelizeQuery } from 'graphql-guru-sequelize';

    export default class People extends SequelizeQuery {
    }
    ```

    server/modules/resolverMutation.js
    ```
    import { SequelizeMutation } from 'graphql-guru-sequelize';

    export default class People extends SequelizeMutation {
    }
    ```
5) Add the methods to your schema files

server/modules/schemaQuery.js
```
peopleResolve(id: String): People
peopleFindAll(id: String): [People]
peopleFindById(id: String): People
peopleFindManyById(id: [String]): [People]
```

server/modules/schemaMutation.js
```
# Add description
peopleCreate(
  firstName: String,
  lastName:  String
): People

# Add description
peopleRemove (
  id: String
): People

# Add description
peopleUpdate(
  id:        String,
  firstName: String,
  lastName:  String
): People
```

# Usage
Once all the installation steps are complete you're go to go.

You can overwrite the methods with your own or add new methods inside the resolvers.

# Database methods
For database usage see [sequelizejs.com]http://docs.sequelizejs.com/

# License
MIT
