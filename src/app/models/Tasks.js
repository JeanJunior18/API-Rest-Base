const mongoose = require('../../database');
const bcrypt = require('bcryptjs')

const TaskSchema = new mongoose.Schema({
    title:{
        type:String, 
        required:true
    },
    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Project',
        required:true
    },
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    completed:{
        type: Boolean,
        required: true,
        default: false
    },
    createdAt:{
        type: Date, 
        default: new Date
    }

});


const Task = mongoose.model('Tasks', TaskSchema);

module.exports = Task