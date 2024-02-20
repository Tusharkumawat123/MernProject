const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/formdata',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log('connection Sucessfully');
}).catch((e)=>{
    console.log(`connection failed`);
})