const express = require('express')
const authMiddleware = require('../../app/middlewares/auth')
const router = express.Router()

const Project = require('../models/Projects')
const Task = require('../models/Tasks')

router.use(authMiddleware)

router.get('/', async (req,res)=>{
    try{
        const projects = await Project.find().populate('user')

        return res.send({ projects })
    }catch(err){
        return res.status(400).send({'error':err})
    }
})

router.get('/:projectId', async (req,res)=>{
    try{
        const project = await Project.findById(req.params.projectId).populate('user')

        return res.send({ project })
    }catch(err){
        return res.status(400).send({'error':err})
    }
})

router.post('/', async (req,res)=>{
    try{
        const { title, description} = req.body
        const project = await Project.create({ title, description, user: req.userId });

        
        return res.send({ project })
    }catch(err){
        return res.status(400).send({'error':err})
    }
})

router.put('/:projectId', async (req,res)=>{
    try{
        const { title, description } = req.body
        const updateData = {}
        if(title) updateData['title'] = title
        if(description) updateData['description'] = description
        const updated = await Project.findByIdAndUpdate(req.params.projectId,updateData)
        return res.send()
    }catch(err){
        console.log(err)
        return res.status(400).send({'error':err})
    }
})

router.delete('/:projectId', async (req,res)=>{
    try{
        const project = await Project.findByIdAndRemove(req.params.projectId)

        return res.send({ project })
    }catch(err){
        return res.status(400).send({'error':err})
    }
})

module.exports = app => app.use('/projects', router)