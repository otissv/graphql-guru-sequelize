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
  database,
  password,
  port,
  dialect,
  host,
  pool,
  storage
}) {
  const db = new Sequelize(database, username, password, {
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
    const fields = json[TABLE].schema;

    return promise((resolve, reject) => {
      Model({
        db,
        fields,
        table: TABLE
      })
        .then(sql =>
          sql.findAll({
            attributes: Object.keys(fields)
          })
        )
        .then(response => response.map(item => item.dataValues))
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }

  findById ({ query, args, databases, models, json }) {
    const db = databases.sequelize;
    let obj = args || query;
    const TABLE = this.table;
    const fields = json[TABLE].schema;
    console.log(obj.id);
    return promise((resolve, reject) => {
      Model({
        db,
        fields,
        table: TABLE
      })
        .then(sql =>
          sql.findOne({
            attributes: Object.keys(fields),
            where: { id: obj.id }
          })
        )
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }

  findManyById ({ query, args, databases, models, json }) {
    const db = databases.sequelize;
    let obj = args || query;
    const TABLE = this.table;
    const fields = json[TABLE].schema;

    return promise((resolve, reject) => {
      Model({
        db,
        fields,
        table: TABLE
      })
        .then(sql =>
          sql.findAll({
            attributes: Object.keys(fields),
            where: { id: obj.id }
          })
        )
        .then(response => response.map(item => item.dataValues))
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }
}

export class SequelizeMutation {
  constructor () {
    autobind(this);
  }

  create ({ args, databases, models, json }) {
    const db = databases.sequelize;
    const TABLE = this.table;
    const fields = json[TABLE].schema;

    return promise((resolve, reject) => {
      Model({
        db,
        fields,
        table: TABLE
      })
        .then(sql => sql.create(args))
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }

  remove ({ args, databases, models, json }) {
    const db = databases.sequelize;
    const TABLE = this.table;
    const fields = json[TABLE].schema;

    return promise((resolve, reject) => {
      Model({
        db,
        fields,
        table: TABLE
      })
        .then(sql =>
          sql.destroy({
            where: { id: args.id }
          })
        )
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }

  update ({ args, databases, models, json }) {
    const db = databases.sequelize;
    const TABLE = this.table;
    const fields = json[TABLE].schema;

    return promise((resolve, reject) => {
      Model({
        db,
        fields,
        table: TABLE
      })
        .then(sql =>
          sql.update(args, {
            where: { id: args.id }
          })
        )
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }

  createMany ({ args, databases, models, json }) {
    const db = databases.sequelize;
    const TABLE = this.table;
    const fields = json[TABLE].schema;

    return promise((resolve, reject) => {
      Model({
        db,
        fields,
        table: TABLE
      })
        .then(sql => sql.bulkCreate(args))
        .then(response => response.map(item => item.dataValues))
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }

  // deleteMany
  // removeMany
  // updateMany
}
