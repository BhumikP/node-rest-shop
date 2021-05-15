
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');

const mongoUrl='mongodb+srv://Bhumik:'+process.env.MONGO_APP_PW+'@node0.e9nli.mongodb.net/Bhumik?retryWrites=true&w=majority';
mongoose.connect(mongoUrl,{useNewUrlParser:true,useUnifiedTopology:true});
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/order');
const userRouter=require('./routes/user');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if (req.method === 'OPTION') {
        res.header('Access-Control-Allow-Origin', 'PUT,POST,GET,DELETE')
        return res.status(200).json({});
    }
    next();
})

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user',userRouter);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {

    res.status(error.status || 500)
    res.json({
        message: error.message
    })
})

module.exports = app;