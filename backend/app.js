const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const path = require('path');
const bodyParser = require('body-parser');

/**Inclusion des routes */
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

/**Connection à mongodb */
mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.1ohtm.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

/**Entete afin de donner accès à l'API a tous le monde */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;