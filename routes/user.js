const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const checkAuth=require('../middleware/check-auth');
router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'User alreadt exist!'
                })
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    }
                    else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                        user.save()
                            .then(result => {
                                return res.status(201).json({
                                    message: 'User Created Successfully!!',
                                    request: {
                                        type: 'POST',
                                        body: {
                                            email: result.email,
                                            password: result.password
                                        }
                                    }
                                })
                            })
                            .catch(err => res.status(404).json({
                                error: err
                            }))
                    }
                })
            }
        })
})

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email }).exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth Failed! mail error'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth Failed!! password error'
                    })
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        }
                        ,
                        process.env.MONGO_JWT_KEY,
                        {
                            expiresIn: "1h"
                        })
                    return res.status(200).json({
                        message: 'Auth Sucess!!',
                        token: token
                    })
                }
                res.status(401).json({
                    message: 'Auth Failed!!'
                })

            })

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.delete('/:userId',checkAuth,(req, res, next) => {
    const id = req.params.userId;
    User.deleteOne({ _id: id }).exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted Successfully !',
                result:result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: "err"+err
            })
        })
})
router.get('/', (req, res, next) => {
    User.find()
        .select('-__v')
        .then(user => {
            const response = {
                count: user.length,
                users: user.map(u => {
                    return {
                        email: u.email,
                        id: u._id,
                        request: {
                            type: 'GET',
                            url: 'localhost:8000/user'
                        }
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(err => {
            res.status(404).json({
                error: err
            })
        })
})

module.exports = router;