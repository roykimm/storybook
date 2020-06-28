const mongoose = require('mongoose');

const WordSchema = new mongoose.Schema({

    word : {
        type : String,
        required : true,
    },
    meaning : {
        type : String,
        required : true
    },
    status : {
        type : String,
        default : 'public',
        enum : ['public','private']
    },
    language : {
        type : String,
        default : 'english',
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

module.exports = mongoose.model('Word', WordSchema);