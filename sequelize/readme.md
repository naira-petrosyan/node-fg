# Sequelize

Sequelize is a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite, and Microsoft SQL Server. 
Its features are solid transaction support, relations, eager and lazy loading, read replication and many more.

### Features of Sequelize:

* Sequelize is a third-party package to be precise its an Object-Relational Mapping Library(ORM).
* Standardization ORMs usually have a single schema definition in the code. This makes it very clear what the schema is, and very simple to change it.
* No need to learn SQL – queries are written in plain JavaScript.

## Setting up a Node.js app:

### Installation of Sequelize:
1. Sequelize needs SQL module installed in your project. if you have not installed SQL module then make sure before installing Sequelize you need to install it. Examples of SQL modules are: 
* `npm install --save pg pg-hstore` # Postgres
* `npm install --save mysql2`
* `npm install --save mariadb`
* `npm install --save sqlite3`
* `npm install --save tedious` # Microsoft SQL Server

2. After installing the SQL module, we have to install Sequelize module to install this module by using the following command.
`npm install sequelize`
   
### Requiring module:
You need to include Sequelize module in your project by using these lines.
`const Sequelize = require('sequelize');`

### Configuring database.js file:

```js
// Include Sequelize module
const Sequelize = require('sequelize')

// Creating new Object of Sequelize
const sequelize = new Sequelize(
	'DATABASE_NAME',
	'DATABASE_USER_NAME',
	'DATABASE_PASSWORD', {

		// Explicitly specifying
		// mysql database
		dialect: 'mysql',

		// By default host is 'localhost'		
		host: 'localhost'
	}
);

// Exporting the sequelize object.
// We can use it in another file
// for creating models
module.exports = sequelize
```

https://sequelize.org/v6/manual/getting-started.html#connecting-to-a-database

## New databases versus existing databases
If you are starting a project from scratch, and your database is still empty, Sequelize can be used since the beginning in order to automate the creation of every table in your database.

Also, if you want to use Sequelize to connect to a database that is already filled with tables and data, that works as well! Sequelize has got you covered in both cases.


## Logging
By default, Sequelize will log to console every SQL query it performs. The options.logging option can be used to customize this behavior, by defining the function that gets executed every time Sequelize would log something. The default value is console.log and when using that only the first log parameter of log function call is displayed. For example, for query logging the first parameter is the raw query and the second (hidden by default) is the Sequelize object.

Common useful values for options.logging
```js
const sequelize = new Sequelize('sqlite::memory:', {
  // Choose one of the logging options
  logging: console.log,                  // Default, displays the first parameter of the log function call
  logging: (...msg) => console.log(msg), // Displays all log function call parameters
  logging: false,                        // Disables logging
  logging: msg => logger.debug(msg),     // Use custom logger (e.g. Winston or Bunyan), displays the first parameter
  logging: logger.debug.bind(logger)     // Alternative way to use custom logger, displays all messages
});
```

##Promises and async/await

Most of the methods provided by Sequelize are asynchronous and therefore return Promises. They are all Promises , so you can use the Promise API (for example, using then, catch, finally) out of the box.

Of course, using async and await works normally as well.

## Model Basics

### Concept
Models are the essence of Sequelize. A model is an abstraction that represents a table in your database. In Sequelize, it is a class that extends Model.

The model tells Sequelize several things about the entity it represents, such as the name of the table in the database and which columns it has (and their data types).

A model in Sequelize has a name. This name does not have to be the same name of the table it represents in the database. Usually, models have singular names (such as User) while tables have pluralized names (such as Users), although this is fully configurable.

### Model Definition

Models can be defined in two equivalent ways in Sequelize:

Calling sequelize.define(modelName, attributes, options)
Extending Model and calling init(attributes, options)
After a model is defined, it is available within sequelize.models by its model name.

To learn with an example, we will consider that we want to create a model to represent users, which have a firstName and a lastName. We want our model to be called User, and the table it represents is called Users in the database.
```js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const User = sequelize.define('User', {
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
    // allowNull defaults to true
  }
}, {
  // Other model options go here
});

// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true
```

```js
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class User extends Model {}

User.init({
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
    // allowNull defaults to true
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'User' // We need to choose the model name
});

// the defined model is the class itself
console.log(User === sequelize.models.User); // true
```
Both ways to define this model are shown below. After being defined, we can access our model with sequelize.models.User.

### Model synchronization
When you define a model, you're telling Sequelize a few things about its table in the database. However, what if the table actually doesn't even exist in the database? What if it exists, but it has different columns, less columns, or any other difference?

This is where model synchronization comes in. A model can be synchronized with the database by calling model.sync(options), an asynchronous function (that returns a Promise). With this call, Sequelize will automatically perform an SQL query to the database. Note that this changes only the table in the database, not the model in the JavaScript side.

`User.sync()` - This creates the table if it doesn't exist (and does nothing if it already exists)
`User.sync({ force: true })` - This creates the table, dropping it first if it already existed
`User.sync({ alter: true })` - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
Example:

```js
await User.sync({ force: true });
console.log("The table for the User model was just (re)created!");
```

https://sequelize.org/v6/manual/model-basics.html
https://sequelize.org/v6/manual/model-querying-basics.html
https://sequelize.org/v6/manual/model-querying-finders.html

## Getters, Setters & Virtuals

Sequelize allows you to define custom getters and setters for the attributes of your models.

Sequelize also allows you to specify the so-called virtual attributes, which are attributes on the Sequelize Model that doesn't really exist in the underlying SQL table, but instead are populated automatically by Sequelize. They are very useful to create custom attributes which also could simplify your code, for example.

### Getters

```js
const User = sequelize.define('user', {
  // Let's say we wanted to see every username in uppercase, even
  // though they are not necessarily uppercase in the database itself
  username: {
    type: DataTypes.STRING,
    get() {
      const rawValue = this.getDataValue('username');
      return rawValue ? rawValue.toUpperCase() : null;
    }
  }
});
```

```js
const user = User.build({ username: 'SuperUser123' });
console.log(user.username); // 'SUPERUSER123'
console.log(user.getDataValue('username')); /
```
### Setters

```js
const User = sequelize.define('user', {
  username: DataTypes.STRING,
  password: {
    type: DataTypes.STRING,
    set(value) {
      // Storing passwords in plaintext in the database is terrible.
      // Hashing the value with an appropriate cryptographic hash function is better.
      this.setDataValue('password', hash(value));
    }
  }
});
```

```js
const user = User.build({ username: 'someone', password: 'NotSo§tr0ngP4$SW0RD!' });
console.log(user.password); // '7cfc84b8ea898bb72462e78b4643cfccd77e9f05678ec2ce78754147ba947acc'
console.log(user.getDataValue('password')); // '7cfc84b8ea898bb72462e78b4643cfccd77e9f05678ec2ce78754147ba947acc'

```

### Virtual fields

Virtual fields are fields that Sequelize populates under the hood, but in reality they don't even exist in the database.

For example, let's say we have the firstName and lastName attributes for a User.
It would be nice to have a simple way to obtain the full name directly! We can combine the idea of getters with the special data type Sequelize provides for this kind of situation: DataTypes.VIRTUAL:

```js
const { DataTypes } = require("sequelize");

const User = sequelize.define('user', {
  firstName: DataTypes.TEXT,
  lastName: DataTypes.TEXT,
  fullName: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${this.firstName} ${this.lastName}`;
    },
    set(value) {
      throw new Error('Do not try to set the `fullName` value!');
    }
  }
});
```
The VIRTUAL field does not cause a column in the table to exist. In other words, the model above will not have a fullName column. However, it will appear to have it!
```js
const user = await User.create({ firstName: 'John', lastName: 'Doe' });
console.log(user.fullName); // 'John Doe'
```
https://sequelize.org/v6/manual/getters-setters-virtuals.html

## Validations & Constraints
```js
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

const User = sequelize.define("user", {
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  hashedPassword: {
    type: DataTypes.STRING(64),
    validate: {
      is: /^[0-9a-f]{64}$/i
    }
  }
});

(async () => {
  await sequelize.sync({ force: true });
  // Code here
})();
```

### Difference between Validations and Constraints
Validations are checks performed in the Sequelize level, in pure JavaScript. They can be arbitrarily complex if you provide a custom validator function, or can be one of the built-in validators offered by Sequelize. If a validation fails, no SQL query will be sent to the database at all.

On the other hand, constraints are rules defined at SQL level. The most basic example of constraint is an Unique Constraint. If a constraint check fails, an error will be thrown by the database and Sequelize will forward this error to JavaScript (in this example, throwing a SequelizeUniqueConstraintError). Note that in this case, the SQL query was performed, unlike the case for validations.
https://sequelize.org/v6/manual/validations-and-constraints.html

## Associations
Sequelize supports the standard associations: One-To-One, One-To-Many and Many-To-Many.

To do this, Sequelize provides four types of associations that should be combined to create them:

The HasOne association
The BelongsTo association
The HasMany association
The BelongsToMany association

### Defining the Sequelize associations

```js
const A = sequelize.define('A', /* ... */);
const B = sequelize.define('B', /* ... */);

A.hasOne(B); // A HasOne B
A.belongsTo(B); // A BelongsTo B
A.hasMany(B); // A HasMany B
A.belongsToMany(B, { through: 'C' }); // A BelongsToMany B through the junction table C

```

They all accept an options object as a second parameter (optional for the first three, mandatory for belongsToMany containing at least the through property):

The order in which the association is defined is relevant. In other words, the order matters, for the four cases. In all examples above, A is called the source model and B is called the target model. This terminology is important.

The A.hasOne(B) association means that a One-To-One relationship exists between A and B, with the foreign key being defined in the target model (B).

The A.belongsTo(B) association means that a One-To-One relationship exists between A and B, with the foreign key being defined in the source model (A).

The A.hasMany(B) association means that a One-To-Many relationship exists between A and B, with the foreign key being defined in the target model (B).

These three calls will cause Sequelize to automatically add foreign keys to the appropriate models (unless they are already present).

The A.belongsToMany(B, { through: 'C' }) association means that a Many-To-Many relationship exists between A and B, using table C as junction table, which will have the foreign keys (aId and bId, for example). Sequelize will automatically create this model C (unless it already exists) and define the appropriate foreign keys on it.

Note: In the examples above for belongsToMany, a string ('C') was passed to the through option. In this case, Sequelize automatically generates a model with this name. However, you can also pass a model directly, if you have already defined it.

### Creating the standard relationships
As mentioned, usually the Sequelize associations are defined in pairs. In summary:

* To create a One-To-One relationship, the hasOne and belongsTo associations are used together;
* To create a One-To-Many relationship, the hasMany and belongsTo associations are used together;
* To create a Many-To-Many relationship, two belongsToMany calls are used together.

https://sequelize.org/v6/manual/assocs.html

## Other topics
https://sequelize.org/v6/manual/transactions.html
https://sequelize.org/v6/manual/hooks.html
https://sequelize.org/v6/manual/query-interface.html
https://sequelize.org/v6/manual/migrations.html
