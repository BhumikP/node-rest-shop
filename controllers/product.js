const Product = require('../models/product');
    exports.get_all_product=(req, res, next) => {
        Product.find()
            .select('-__v')
            .exec()
            .then(docs => {
                const response = {
                    count: docs.length,
                    product: docs.map(doc => {
                        return {
                            name: doc.name,
                            price: doc.price,
                            _id: doc._id,
                            request: {
                                type: 'GET',
                                url: 'localhost:8000/products/' + doc._id
                            }
                        }
                    })
                }
                res.status(200).json(response)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: err
                })
            })
    }