const express = require('express')
const router = express.Router()

const Student = require('../models/student.js') //this is how you import a model

//get all students
router.get('/', async (req, res)=>{
    try{
        const students = await Student.find()
        res.status(200).json(students)
    }catch(err){
        console.error(err)
        res.status(500).json({ message: "Something went wrong on the server" }) //500 error to show that something wrong on the server's end
    }
})
router.param('id', async (req, res, next, id)=>{
    let student
    try{
        student = await Student.findById(id)
        if(!student){
            return res.status(404).json({ message: "student not found" })
        }
        
    } catch(err){
        res.status(400).json({ message: err.message })
    }
    req.student = student
    next()
})
//get student by id
router.get('/:id', (req, res)=>{
    res.status(200).json(req.student)
})
//create new student
router.post('/', async (req, res)=>{
    try{
        if(!req.body.name || !req.body.age) return res.status(400).json({ message: "Name and age are required"})
        const student = new Student({
            name: req.body.name,
            age: req.body.age
        })
        await student.save();
        res.status(201).json(student)
    }catch (err){
        res.status(400).json({ message: err.message })
    }
})
//update student info by id
router.patch('/:id', async (req, res)=>{
    //whatever the user gives, change those fields only
    if(req.body.name != null) req.student.name = req.body.name
    if(req.body.age != null) req.student.age = req.body.age
    
    try{
        await req.student.save()
        res.status(200).json(req.student)
    } catch (err){
        res.status(400).json({ message: err.message })
    }
})
//delete student by id
router.delete('/:id', async (req, res)=>{
    try{
        await req.student.deleteOne()
        res.status(200).json(`student with ID: ${req.params.id} deleted`)
    }catch(err){
        console.error(err)
        res.status(500).json({ message: "Something went wrong on the server" })
    }
})
//delete by name
router.delete('/name/:name', async (req, res)=>{
    try{
        const deleted = await Student.deleteMany({ name: req.params.name })
        if(deleted.deletedCount === 0){
            res.status(404).json({ message: "No matching students found"})
        }
        else res.status(200).json({ message: `${ deleted.deletedCount } Students with name: ${req.params.name} deleted`})
    } catch(err){
        console.error(err)
        res.status(500).json({ message: "Something went wrong on the server" })
    }
})
router.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

module.exports = router