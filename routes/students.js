const express = require('express')
const router = express.Router()

const Student = require('../models/student.js') //this is how you import a model

//get all students
router.get('/', async (req, res)=>{
    try{
        const students = await Student.find()
        res.json(students)
    }catch(err){
        res.status(500).json({ message: err.message }) //500 error to show that something wrong on the server's end
    }
})
router.param('id', async (req, res, next, id)=>{
    let student
    try{
        student = await Student.findById(id)
        if(student == null){
            res.json({ message: "student not found" })
        }
        
    } catch(err){
        res.json({ message: err.message })
    }
    req.student = student
    next()
})
//get student by id
router.get('/:id', (req, res)=>{
    res.json(req.student)
})
//create new student
router.post('/', async (req, res)=>{
    try{
        const student = new Student({
            name: req.body.name,
            age: req.body.age
        })
        await student.save();
        res.json(student)
    }catch (err){
        console.log({ message: err })
    }
})
//update student info by id
router.patch('/:id', async (req, res)=>{
    //whatever the user gives me i change those fields only
    if(req.body.name != null) req.student.name = req.body.name
    if(req.body.age != null) req.student.age = req.body.age
    
    try{
        await req.student.save()
        res.json(req.student)
    } catch (err){
        res.status(400).json({ message: err.message })
    }
})
//delete student by id
router.delete('/:id', async (req, res)=>{
    await req.student.deleteOne()
    res.json(`student with ID: ${req.params.id} deleted`)
})
//delete by name
router.delete('/name/:name', async (req, res)=>{
    try{
        await Student.deleteMany({
            name: req.params.name
        })
        res.json({ message: `Students with name: ${req.params.name} deleted`})
    } catch(err){
        res.json({ message: err.message })
    }
})

module.exports = router