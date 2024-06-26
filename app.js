const path = require('path');

const express = require('express');

const bodyParser =  require('body-parser');

const app = express();

const adminData = require('./routes/admin');

const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);

app.use(shopRoutes);

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
});

app.listen(3000);

console.log('The penguins of hell listen to most of your qualms!');

