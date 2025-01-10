const express= require('express');
const mongoose = require('mongoose');

const app =express(); 
const PORT = process.env.PORT || 3000;
app.use(express.json()); // to parse the incoming request with JSON payloads

// connect to mongodb
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crud';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// mongo db model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
})

// create a model
const User= mongoose.model('User', userSchema);

// create a new user
app.post('/user', async(req, res)=>{
    try{
        const newUser=new User(req.body);
        const savedUser= await newUser.save();
        res.status(201).json(savedUser);
    }
    catch(err){
        res.status(400).json({
            error: err.message});
    }
})


// get  user with id
app.get('/user/:user', async(req, res)=>{
    try{
        const data= await User.findById(req.params.user);
        res.status(200).json(data); 
    }catch(err){
        res.status(400).json({
            error: err.message
        });
    }
})


// get all users
app.get('/user', async(req, res)=>{
    try{
        const data= await User.find();
        res.status(200).json(data);
    }catch(err){
        res.status(400).json({
            error: err.message
        });
    }
})

// delete user with id
app.delete('/user/:user', async (req, res)=>{
    try{
        const userDeleted= await User.findByIdAndDelete(req.params.user);
        if(!userDeleted){
            return res.status(404).json({
                message: 'User not found'
            });
        }
        res.status(200).json({
            message: 'User deleted successfully'
        });
    }
    catch(err){
        res.status(400).json({
            message: err.message
        });
    }
});

// update user with id
app.put('/user/:user', async(req, res)=>{
    try{
        const updatedUser= await User.findByIdAndUpdate(
            req.params.user,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        if(!updatedUser){
            return res.status(404).json({
                message: 'User not found'
            });
        }
        res.status(200).json(updatedUser);
    }catch{
        res.status(400).json({
            message: err.message
        });
    }
});


app.listen(PORT, () => console.log('Server is running on port 3000'));