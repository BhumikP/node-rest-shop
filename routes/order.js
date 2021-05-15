const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>{
    res.status(200).json({
        message:'GET ORDER'
    })
})

router.post('/',(req,res)=>{
    const order={
        productId:req.body.productId,
        quantity:req.body.quantity
    }
res.status(201).json({
    message:'POST ORDER',
    order:order
})
})
router.get('/:orderId',(req,res)=>{
    res.status(200).json({
        message:'GET with Order ID',
        id:req.params.orderId
    })
})
router.delete('/:orderId',(req,res)=>{
    res.status(200).json({
        message:'DELETE with Order ID',
        id:req.params.orderId
    })
})
module.exports=router;
