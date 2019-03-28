# PROCEDURES
# A->  Create all the folders you need for your project
  i. src/db/
     src/model/
 ii. Routes folder
 ## QUICK EXPLANATION OF THE FUNCTIONS OF THE FOLDERS

 1. The model folder contains a file call model. Model give a structure of the application

 2. Router: This contains all the resources and endpoints a user will request. All the structure created by the model will be used inside this model


## B-> Download and  install mongodb
1. Download the setup [mongodb](https://www.mongodb.com/)
2. After that rename it into mongodb.

3. The bin folder contains all the executabale operations.

4. The mongod is use to start the mongodb server

5. Move the rename folder to your home directory

6. Next create a folder to store the databases. Note:

Always create the folder where you have the mongodb files. The name of the created folder is mongodb-data

# C-> Starting the mongodb server
1. Locate your home directory where you have the mongodb and mongodb-data

2. Run this code /users/emmanuel/mongodb/bin/mongod --dbpath=/users/emmanuel/mongodb-data


###Next install mongodb GUI ROBO 3T
1. [Robo 3T](https://robomongo.org/download)

# D-> Connecting mongoose  using js file
1. Create this file inside the db  as mongoose.js

2. After you launch this file, in your terminal you will established connection to db successfully, you will see otherwise if something went wrong

3. The mongoose connect accept 3 arguements
   a. The url of the database mongodb://127.0.0.1:27017
   b. The name of the database/collection: contact-manager
   c. Optional objects: useNewUrlParser: true,     
                        useCreateIndex: true,     
                        useFindAndModify: false

4. After launching this file,refresh the Robo 3T and you will see that the database has been created

# CODE DEMO
```javascript
 const mongoose = require('mongoose')
 mongoose.connect('mongodb://127.0.0.1:27017/contact-manager', {    
    useNewUrlParser: true,     
    useCreateIndex: true,     
    useFindAndModify: false
}).then( () => {
    console.log('established connection to db successfully')
}).catch( (error) => {
    console.log('failed to establish connection to the db')
});
```

### D->  Create a model
  1. This is the structure of our database

  2. This accept two arguement; the name of your model/Table/Collection  and the fields you want to create

  3. We can set type and validation of the field

  4. Model accept the name of your collection/table, objects thus the fields of the object

  5. Model also accept other options like middleware
  
  6. Create this user model inside the model folder

  7. After that export it to make available 

  ```javascript
    const mongoose = require('mongoose')
    
   
# E-> DIFERENCE BETWEEN SCHEMA AND A MODEL
1. Schema defines the application of our database. It is the blueprint of our database
 or A MongoDB schema defines the structure of any documents that are stored in a particular collection. You can think of it as blueprints to build a house.

 2. A model is use to create a real object based on the schema. Model accepts two arguement;
     i. The name of the object we want to create and the blueprint (schema). After this we have to export it

     OR A MongoDB model provides the interface to perform Create, Read, Update and Delete (CRUD) operations on the collection as a whole or an individual document.



# G-> CREATING USER MODEL
1. This accept the name of your collection/table (User)and the properties you want to define

```javascript
const User = mongoose.model('User',  {
    name: {
         type: String,
         required: true, 
         trim: true
    },
    email: {
        type:String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value){
          if(value.toLowerCase().includes('password')) {
              throw new Error('Password cannot contain password')
          }
      }
    },
    age: {
         type: Number,
         default: 0,
         validate(value) {
             if(value < 0){
                 throw new Error('Age must be a positive number')
             }
         }
    },
  })

  module.exports = User;
```

# F-> CREATING EXPRESS SERVER
1. Create an index.js file that's the root of the application

2. Install nodemon and express
[Express](https://expressjs.com/)
[Nodemon](https://www.npmjs.com/package/nodemon)

### CODE DEMO
```javascript
const express = require('express');
const app = express() //This create express application
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server is running on port', port)
})
```

### H->. CREATING INSTANCE OF THE MODEL/CREATING REAL OBJECT

1. NOTE: We always create instance of

2. After creating the instance we can do all sorts of operation on the object, example, saving, updating or deleting the object

3. we use .save() to save it to the database

# CREATING A USER / POST METHOD

1. The user defination/structure was created inside the user model folder so to be able to create an instance of it we have to require it. 
```javascript
  const User  = require('../src/model/users')
```
2. After we required it, we have to create an instance of that user model
```javascript
const user = new User()
```

3. The requirement of this user model is to pass in object, and for our case we can get access our object through (req.body). The above code now becomes
```javascript
 const user = new User(req.body)
```

```javascript
const express = require('express');
const router = new  express.Router()
const User  = require('../src/model/users')


router.post('/user', async (req, res)=> {
    const user = new User(req.body)

        try {
            //Saving to database
        const users = await user.save()
        res.send(users)

        } catch(error) {
            res.status(500).send()
    }
  })
})
```

# FETCHING ALL USERS / GET METHOD
1. find({}) returns all users

2. This return a promise
```javascript
const express = require('express');
const router = new  express.Router()
const User  = require('../src/model/users')

router.get('/users', (req, res) => {

  User.find({}).then((users)=> {
      res.send(users)
  }).catch(()=> {
    res.status(500).send()
  })
})
```

# SEARCHING FOR USER BY ID / GET METHOD
```javascript
//Searching for user
router.get('/user/:id', (req, res)=> {
 const _id = req.params.id;
 User.findById(_id).then((user)=> {
      if(!user){
          return res.status(404).send()
      }
      res.send(user)
   }).catch((error)=> {

   })
})
```

# UPDATING USER / PATCH METHOD

```javascript
//UPDATING
router.patch('/users/:id', async (req, res)=> {

const allowedUpdates = ['name', 'email', 'password', 'age'];
const updates = Object.keys(req.body);
const isValidOperation = updates.every((update)=> {
 return allowedUpdates.includes(update)
})

if(!isValidOperation) {
  return res.status(400).send({Error: 'Invalide Operation'})
}

  try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
      res.send(user)
      if(!user) {
          return res.status(404).send()
      }
      res.send(user)
  } catch (error) {
      res.status(400)
      
  }

})
```


# DELETING USER / DELETE METHOD
```javascript
//DELETING 
router.delete('/users/:id',async (req, res) => {
  try {
      const user = await User.findByIdAndDelete(req.params.id)
      if(!user) {
          return res.status(404).send({Error: 'User is already deleted or not found'})
      }
      res.send(user)

  } catch (error) {
      res.status(500).send()
  }
} )
```

## REGISTERING/USING ON THE INDEX.JS FILE

```javascript
const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const UserRouter = require('../routers/user')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

//Registering the user Router
app.use(UserRouter)

//SERVER
app.listen(port, () => {
    console.log('Server is runing on port ' + port)
})
```
### Resources
1. [mongodb](https://www.mongodb.com/)
2. [Robo 3T](https://robomongo.org/download)
3. [Mongodb driver for node js](https://docs.mongodb.com/ecosystem/drivers/)
4. [Validator](https://www.npmjs.com/package/validator)
5. [Express](https://expressjs.com/)
6. [Nodemon](https://www.npmjs.com/package/nodemon)
7. [http status code](https://httpstatuses.com/)
8. [mongoose queries](https://mongoosejs.com/docs/queries.html)
9. [bcrypts for password](https://www.npmjs.com/package/bcryptjs)
10. [Middleware](https://mongoosejs.com/docs/middleware.html)
11. [Postman](https://www.getpostman.com/)
12. [jwt token for login](https://www.npmjs.com/package/jsonwebtoken)
