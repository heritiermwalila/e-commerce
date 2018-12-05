const express = require('express');
const bodyParser = require('body-parser');
const pagesController = require('./controllers/errors');
const path = require('path');
const rootDir = require('./libs/path-dir');
const sequelize = require('./libs/databases');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

//load templates
app.set('view engine', 'ejs');
app.set('views', 'views');

//store User globally
app.use((req, res, next)=>{
    User.findById(1).then(user=>{
        req.user = user;
        next()
    }).catch(err=>console.log(err))
    
})

//load routers
const adminRouters = require('./routes/admin');
const shopRouters = require('./routes/shop');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouters);
app.use('/', shopRouters);


app.use('/', pagesController.pageNotFound)

Product.belongsTo(User, {constraints:true, onDelete:'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through:CartItem});
Product.belongsToMany(Cart, {through:CartItem});
User.hasMany(Order);
Order.belongsTo(User);
Order.belongsToMany(Product, {through:OrderItem})
sequelize.sync().then(result=>{
    return User.findById(1);
    
}).then(user=>{
    if(!user){
        User.create({id:1, firstName:'Heritier', lastName:'Mwalila', email:'heritier@mail.com', password:'1234'})
    }
    return user;
    
}).then(()=>{

    const port = 3000 || process.env.PORT;
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
    
})
.catch(err=>{
    console.log(err)
})

