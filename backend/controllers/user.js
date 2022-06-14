const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

/**Enregistrement d'un nouvel utilisateur */
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

/**login de l'utilisateur */
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'utilisateur non trouvé' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Mot de passe incorrect' });
                    }
                    console.log(valid);
                    res.status(200).json({
                        token: jwt.sign({ userId: user._id },
                            'RANDOM_TOKEN_SECRET', { expiresIn: '24h' }
                        ),
                        userId: user._id,
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};