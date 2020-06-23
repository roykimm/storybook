const mongoose = require('mongoose');

const StroySchema = new mongoose.Schema({
    
    body : {
        type : String,
        required : true,
    },
    title : {
        type : String,
        required : true,
        trim : true
    },
    status : {
        type : String,
        default : 'public',
        enum : ['public', 'private']
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    createdAt : {
        type : Date,
        default : Date.now,
    }
})

module.exports = mongoose.model('Story', StroySchema);