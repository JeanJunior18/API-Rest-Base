const mongoose = require('../../database');
const bcrypt = require('bcryptjs')

const ProjectSchema = new mongoose.Schema({
    title:{
        type:String, 
        required:true
    },
    description:{
        type: String,
        required:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    Tasks:[{
        type: mongoose.Types.ObjectId,
        ref: 'Task',
    }],
    createdAt:{
        type: Date, 
        default: new Date
    }

});


const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project