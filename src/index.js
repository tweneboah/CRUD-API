const express = require('express');
require('./db/mongoose')
const User = require('./model/users')
const userRouter = require('../routes/users')


const app =  express();
const port = process.env.PORT || 3000

app.use(express.json())// This helps us to cusotomise our sever. This convert json data back to object so that we can access this data on the request body

//Registering Routes
app.use(userRouter)

app.listen(port, () => {
    console.log('Server is runinng on port ' + port)
})