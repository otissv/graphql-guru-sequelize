'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SequelizeMutation = exports.SequelizeQuery = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.promise = promise;
exports.connect = connect;

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _classAutobind = require('class-autobind');

var _classAutobind2 = _interopRequireDefault(_classAutobind);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function promise(fn) {
  return new Promise(function (resolve, reject) {
    return fn(resolve, reject);
  });
}

function Model(_ref) {
  var db = _ref.db,
      fields = _ref.fields,
      table = _ref.table;

  var types = {
    array: _sequelize2.default.ARRAY(_sequelize2.default.TEXT),
    boolean: _sequelize2.default.BOOLEAN,
    number: _sequelize2.default.FLOAT,
    string: _sequelize2.default.STRING
  };

  var Model = db.define(table, Object.keys(fields).reduce(function (previous, field) {
    var current = fields[field];

    return _extends({}, previous, _defineProperty({}, field, {
      type: types[current.type],
      allowNull: !current.required
    }));
  }));

  return Promise.resolve(Model);
}

function connect(_ref2) {
  var username = _ref2.username,
      databases = _ref2.databases,
      port = _ref2.port,
      dialect = _ref2.dialect,
      host = _ref2.host,
      pool = _ref2.pool,
      storage = _ref2.storage;

  var db = new _sequelize2.default('database', 'username', 'password', {
    host: host,
    dialect: dialect,
    pool: pool,
    storage: storage
  });

  db.authenticate().then(function () {
    console.log('Connection has been established successfully.');
  }).catch(function (err) {
    console.error('Unable to connect to the database:', err);
  });

  return db;
}

var SequelizeQuery = exports.SequelizeQuery = function () {
  function SequelizeQuery() {
    _classCallCheck(this, SequelizeQuery);

    (0, _classAutobind2.default)(this);
  }

  _createClass(SequelizeQuery, [{
    key: 'resolve',
    value: function resolve(params) {
      return Array.isArray(params.args) ? this.findManyById(_extends({}, params, { args: { id: params.args } })) : this.findById(params);
    }
  }, {
    key: 'findAll',
    value: function findAll(_ref3) {
      var args = _ref3.args,
          databases = _ref3.databases,
          models = _ref3.models,
          json = _ref3.json;

      var db = databases.sequelize;
      var TABLE = this.table;

      return promise(function (resolve, reject) {
        Model({
          db: db,
          fields: json[TABLE].schema,
          table: TABLE
        }).then(function (sql) {
          return sql.findAll();
        }).then(function (response) {
          return response.map(function (item) {
            return item.dataValues;
          });
        }).then(function (data) {
          return resolve(data);
        }).catch(function (error) {
          return reject(error);
        });
      });
    }
  }, {
    key: 'findById',
    value: function findById(_ref4) {
      var query = _ref4.query,
          args = _ref4.args,
          databases = _ref4.databases,
          models = _ref4.models;

      var db = databases.sequelize;
      var obj = args || query;
      var TABLE = this.table;
    }
  }, {
    key: 'findManyById',
    value: function findManyById(_ref5) {
      var query = _ref5.query,
          args = _ref5.args,
          databases = _ref5.databases,
          models = _ref5.models;

      var db = databases.sequelize;
      var obj = args || query;
      var TABLE = this.table;
      var ids = obj.id.map(function (id) {
        return { id: id };
      });
    }
  }]);

  return SequelizeQuery;
}();

var SequelizeMutation = exports.SequelizeMutation = function () {
  function SequelizeMutation() {
    _classCallCheck(this, SequelizeMutation);

    (0, _classAutobind2.default)(this);
  }

  _createClass(SequelizeMutation, [{
    key: 'create',
    value: function create(_ref6) {
      var args = _ref6.args,
          databases = _ref6.databases,
          models = _ref6.models;

      var db = databases.sequelize;
      var TABLE = this.table;
    }
  }, {
    key: 'remove',
    value: function remove(_ref7) {
      var args = _ref7.args,
          databases = _ref7.databases,
          models = _ref7.models;

      var db = databases.sequelize;
      var id = args.id;
      var TABLE = this.table;
    }
  }, {
    key: 'update',
    value: function update(_ref8) {
      var args = _ref8.args,
          databases = _ref8.databases,
          models = _ref8.models;

      var db = databases.sequelize;
      var id = args.id;
      var TABLE = this.table;
    }

    // createMany
    // deleteMany
    // removeMany
    // updateMany

  }]);

  return SequelizeMutation;
}();
//# sourceMappingURL=sequelize.js.map