const express = require('express');

const router = new  express.Router()
const User = require('../src/model/users')


//Creating user/POST

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

//Fetching all users
router.get('/users', (req, res) => {

  User.find({}).then((users)=> {
      res.send(users)
  }).catch(()=> {
    res.status(500).send()
  })
})

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

 module.exports = router;