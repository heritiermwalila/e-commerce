const Product = require('../models/product');
let products;
exports.getAddProductPage = (req, res, next)=>{
    // res.sendFile(path.join(rootDir, 'views', 'admin.html'));
    
   res.render('admin/edit-product', {docTitle:"Add Product", path:"add-product", editing:false})
}
exports.postAddProduct = (req, res, next)=>{
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    req.user.createProduct({
        name:name,
        description:description,
        price:price,
        imageUrl:imageUrl,
        userId:req.user.id
    }).then(()=>{
         res.redirect('back');
    }).catch(err=>{
        console.log(err)
    })
}

exports.getProducts = (req, res, next)=>{
    req.user.getProducts().then(products=>{
        res.render('admin/product-list', {prods: products, path:'product-list', docTitle:'All products'})
    }).catch(err=>{
        console.log(err);
    })

    
}
exports.editProducts = (req, res, next)=>{
    const id = req.params.id;
    const editMode = req.query.edit;
    if(!editMode){
         res.redirect('/');
    }
    req.user.getProducts({where:{id:id}}).then(product=>{
        const prod = product[0];
        res.render('admin/edit-product', {product: prod, docTitle:"Edit Product", path:"edit-product", editing:editMode});

    }).catch(err=>{

    })
}

exports.updateProduct = (req, res, next)=>{
    const id = req.body.productId;
    const name = req.body.name;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    Product.findById(id).then(product=>{
        product.name = name;
        product.imageUrl = imageUrl;
        product.description = description;
        product.price = price;
        product.save();
         res.redirect('back');
    }).catch(err=>{
        console.log(err)
    })
}
exports.deleteProduct = (req, res, next)=>{
    const id = req.body.productId;
    Product.findById(id).then(product=>{
        product.destroy();
        
    }).then(()=>{
        res.redirect('back');
    })
}