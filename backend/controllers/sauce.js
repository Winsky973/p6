const fs = require('fs');

const Sauce = require('../models/Sauce');


/**Create one */
exports.createSauce = (req, res, next) => {

    const sauce = new Sauce({
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

/**Update one */
exports.modifySauce = (req, res, next) => {

    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };

    /**Before update we take the old url image and delete it than push the new image */
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {

            if (req.file) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, function(error) {
                    if (error) return error;
                    console.log('image delete');
                });
            }
            Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'objet modifié' }))
                .catch(error => res.status(400).json({ error }));

        })
        .catch((error) => { res.status(400).json({ error: error }) });
};

/**Delete one */
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                res.status(404).json({
                    error: new Error('aucun objet trouvé')
                })
            }
            if (sauce.userId !== req.auth.userId) {
                res.status(400).json({
                    error: new Error('Requête non autorisée')
                });
            }
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {

                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé' }))
                    .catch(error => res.status(400).json({ error }));
            });

        })
        .catch((error) => { res.status(400).json({ error: error }) });
};

/**Get one */
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })

    .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

/**get all sauce */
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

/**Like a sauce */
exports.likeSauce = (req, res, next) => {
    const likes = req.body.like;
    const userId = req.body.userId;

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {

            switch (likes) {
                case 1:
                    if (!foundIdFromArray(sauce['usersLiked'], userId)) {
                        sauce.likes += likes;
                        sauce['usersLiked'].push(userId);
                    }

                    Sauce.updateOne({ _id: req.params.id }, sauce)
                        .then(() => res.status(200).json({ message: 'Like enregistré' }))
                        .catch(error => res.status(400).json({ error }))
                    break;

                case -1:
                    if (!foundIdFromArray(sauce['usersDisliked'], userId) && !foundIdFromArray(sauce['usersLiked'], userId)) {
                        sauce.dislikes += 1;
                        sauce['usersDisliked'].push(userId);
                    }
                    Sauce.updateOne({ _id: req.params.id }, sauce)
                        .then(() => res.status(200).json({ message: 'Like enregistré' }))
                        .catch(error => res.status(400).json({ error }))
                    break;

                case 0:
                    const foundIndexIdUsersLiked = sauce['usersLiked'].findIndex(element => element === userId);
                    const foundIndexIdUsersDisliked = sauce['usersDisliked'].findIndex(element => element === userId);

                    if (foundIndexIdUsersLiked !== -1) {
                        sauce['usersLiked'].splice(foundIndexIdUsersLiked);
                        sauce.likes -= 1;
                    }
                    if (foundIndexIdUsersDisliked !== -1) {
                        sauce['usersDisliked'].splice(foundIndexIdUsersDisliked);
                        sauce.dislikes -= 1;
                    }
                    Sauce.updateOne({ _id: req.params.id }, sauce)
                        .then(() => res.status(200).json({ message: 'Like enregistré' }))
                        .catch(error => res.status(400).json({ error }))
                    break;

                default:
                    break;
            }

        })
        .catch(error => res.status(400).json({ error }));
}

function foundIdFromArray(array, userId) {
    const foundIdInArray = array.find(element => element === userId);
    if (foundIdInArray) {
        return true;
    }
}