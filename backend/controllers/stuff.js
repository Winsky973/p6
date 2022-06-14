const fs = require('fs');

const Thing = require('../models/Thing');


/**Create one */
exports.createThing = (req, res, next) => {
    delete req.body._id;
    const thing = new Thing({
        ...req.body,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    thing.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

/**Update one */
exports.modifyThing = (req, res, next) => {
    const thingObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };

    Thing.updateOne({ _id: req.params.id }, {...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'objet modifié' }))
        .catch(error => res.status(400).json({ error }))
};

/**Delete one */
exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then((thing) => {
            if (!thing) {
                res.status(404).json({
                    error: new Error('aucun objet trouvé')
                })
            }
            if (thing.userId !== req.auth.userId) {
                res.status(400).json({
                    error: new Error('Requête non autorisée')
                });
            }
            const filename = thing.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {

                Thing.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé' }))
                    .catch(error => res.status(400).json({ error }));
            });

        })
        .catch((error) => { res.status(400).json({ error: error }) });
};

/**Get one */
exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })

    .then(thing => res.status(200).json(thing))
        .catch(error => res.status(400).json({ error }));
};

/**get all thing */
exports.getAllThings = (req, res, next) => {
    Thing.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }));
};