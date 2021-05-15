const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const checkAuth=require('../middleware/check-auth'); 
const productController=require('../controllers/product');

router.get('/', checkAuth,productController.get_all_product);
router.post('/', checkAuth,(req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().
        then(result => {
            console.log(result)
            res.status(201).json({
                message: 'Created Product Succesfully',
                createProduct:{
                    name:result.name,
                    price:result.price,
                    _id:result._id,
                    request:{
                        type:'GET',
                        url:'localhost:8000/products/' + result._id
                    }
                }
            })
        })
        .catch(error => {
            console.log(error)
            res.status(404).json({
                error: error
            })
        });


});

router.get('/:productId',checkAuth, (req, res) => {
    const id = req.params.productId
    Product.findById(id)
    .select('-__v')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    product:doc,
                    request:{
                        type:'GET',
                        url:'localhost:8000/products/' + id
                    }
                })
            }
            else {
                res.status(404).json({
                    error: 'No Valid Entry Found'
                })
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

router.patch('/:productId', checkAuth,(req, res) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message:'Product Updated',
                request:{
                    type:'GET',
                    url:'localhost:8000/products/'+id
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.delete('/:productId', checkAuth,(req, res) => {
    const id = req.params.productId;
    Product.deleteOne({_id: id }).exec()
        .then(result => {
            res.status(200).json({
                message:'Product Deleted',
                request:{
                    type:'POST',
                    url:'localhost:8000/products/',
                    result:result,
                    body:{
                        name:'String',
                        price:'Number'
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json(
                { error: err }
            )
        })
})



module.exports = router;