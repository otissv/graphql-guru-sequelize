import Sequelize from 'sequelize';
import autobind from 'class-autobind';

export function promise (fn) {
  return new Promise((resolve, reject) => fn(resolve, reject));
}

function Model ({ db, fields, table }) {
  const types = {
    array: Sequelize.ARRAY(Sequelize.TEXT),
    boolean: Sequelize.BOOLEAN,
    number: Sequelize.FLOAT,
    string: Sequelize.STRING
  };

  const Model = db.define(
    table,
    Object.keys(fields).reduce((previous, field) => {
      const current = fields[field];

      return {
        ...previous,
        [field]: {
          type: types[current.type],
          allowNull: !current.required
        }
      };
    })
  );

  return Promise.resolve(Model);
}

export function connect ({
  username,
  databases,
  port,
  dialect,
  host,
  pool,
  storage
}) {
  const db = new Sequelize('database', 'username', 'password', {
    host,
    dialect,
    pool,
    storage
  });

  db
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });

  return db;
}

export class SequelizeQuery {
  constructor () {
    autobind(this);
  }

  resolve (params) {
    return Array.isArray(params.args)
      ? this.findManyById({ ...params, args: { id: params.args } })
      : this.findById(params);
  }

  findAll ({ args, databases, models, json }) {
    const db = databases.sequelize;
    const TABLE = this.table;

    return promise((resolve, reject) => {
      Model({
        db,
        fields: json[TABLE].schema,
        table: TABLE
      })
        .then(sql => sql.findAll())
        .then(response => response.map(item => item.dataValues))
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }

  findById ({ query, args, databases, models }) {
    const db = databases.sequelize;
    let obj = args || query;
    const TABLE = this.table;
  }

  findManyById ({ query, args, databases, models }) {
    const db = databases.sequelize;
    let obj = args || query;
    const TABLE = this.table;
    const ids = obj.id.map(id => ({ id }));
  }
}

export class SequelizeMutation {
  constructor () {
    autobind(this);
  }

  create ({ args, databases, models }) {
    const db = databases.sequelize;
    const TABLE = this.table;
  }

  remove ({ args, databases, models }) {
    const db = databases.sequelize;
    const id = args.id;
    const TABLE = this.table;
  }

  update ({ args, databases, models }) {
    const db = databases.sequelize;
    const id = args.id;
    const TABLE = this.table;
  }

  // createMany
  // deleteMany
  // removeMany
  // updateMany
}
