const Product = require('../models/product');
const Cart = require('../models/cart');

let products;
let cart=[];
exports.getProducts = (req, res)=>{
    // console.log(adminData.product)
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));

    // render content with pug

    Product.findAll().then(products=>{
        res.render('shop/product-list', {prods: products, docTitle:'Products', path:'products'});

    }).catch(err=>{
        console.log(err)
    });
    
}

exports.getIndex = (req, res, next)=>{
    Product.findAll().then(products=>{
        res.render('shop/index', {prods: products, docTitle:'Shopping', path:'/'});

    }).catch(err=>{
        console.log(err)
    });
    
}
exports.getCart = (req, res, next)=>{
    req.user.getCart().then(cart=>{
        return cart.getProducts().then(products=>{
            res.render('shop/cart', {products:products, docTitle:'Cart', path:'cart'});
        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
     
}
exports.deleteCartItem = (req, res, next)=>{
    const id = req.body.productId;
    req.user.getCart()
    .then(cart=>{
        return cart.getProducts({where:{id:id}})
    })
    .then(products=>{
        const product = products[0];
        return product.cartItem.destroy();
    })
    .then(()=>{
         res.redirect('/cart');
    })
    .catch(err=>console.log(err))
    
}
exports.getCheckout = (req, res, next)=>{
    res.render('shop/checkout', {docTitle:'Checkout', path:'checkout'});
}


exports.getProduct = (req, res, next)=>{
    const productId = req.params.id;
    Product.findById(productId).then((product)=>{
        
        res.render('shop/product-details', {product:product, docTitle:'Product Details', path:'product-detail'});
    })
   
}

exports.addToCart = (req, res, next)=>{
    const id = req.body.productId;
    let fetchCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart=>{
            fetchCart = cart;
            return cart.getProducts({where:{id:id}})
        })
        .then(products=>{
            let product;
            if(products.length > 0){
                product = products[0];

            }          
            if(product){
                const oldQty = product.cartItem.quantity;
                newQuantity = oldQty + 1;
                return product;
            }
            return Product.findById(id);

        }).then(product=>{
            return fetchCart.addProduct(product, {through:{quantity:newQuantity}})

        })
        .then(()=>{
             res.redirect('/cart');
        })
        .catch(err=>console.log(err))
     
}

exports.orderNow = (req, res, next)=>{
    let fetchCart;
    req.user.getCart()
        .then(cart=>{
            fetchCart = cart;
            return cart.getProducts();
        })
        .then(products=>{
            return req.user.createOrder().then(order=>{
                return order.addProducts(products.map(product=>{
                    product.orderItem = {quantity: product.cartItem.quantity};
                    return product;
                }))
            }).catch(err=>{
                console.log(err)
            })
        }).then(()=>{
            return fetchCart.setProducts(null);
        }).then(result=>{
            
            res.redirect('/orders');
        })
        .catch(err=>console.log(err))
}

exports.getOrders = (req, res, next)=>{
    req.user.getOrders({include:['products']}).then(orders=>{
        res.render('shop/orders', {docTitle:'Your Orders', path:'orders', orders:orders});
    }).catch(err=>console.log(err))
    
}