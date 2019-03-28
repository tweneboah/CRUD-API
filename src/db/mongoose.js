
 const mongoose = require('mongoose')
// mongoose.connect('mongodb://127.0.0.1:27017/contact-manager', {
//     useNewUrlParser: true, 
//     useCreateIndex: true, 
//     useFindAndModify: false
// });



mongoose.connect('mongodb://127.0.0.1:27017/contact-manager', {    
    useNewUrlParser: true,     
    useCreateIndex: true,     
    useFindAndModify: false
}).then( () => {
    console.log('established connection to db successfully')
}).catch( (error) => {
    console.log('failed to establish connection to the db')
});





// const User = mongoose.model('User', {
//     name: {
//         type: String
//     }, 
//     age: {
//         type: Number
//     }
// })


//Creating instance of the model thus creating real person data 
// Now we can do all sorts of operation the object (tweneboah)
//We can do operation like delete, save, update
// const tweneboah = new User({
//     name: 'Emmanuel',
//     age: 30
// })

//Saving the data to database
//This return a promise a promise

// tweneboah.save().then((data)=> {
//    console.log(data)
// }).catch((error) => {
//    console.log('Error', error)
// })

