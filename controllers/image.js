const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'e1da414096684f9aa46a437b66f35bf3'
});

const handleApiCall = (req, res) => {
   app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id) //the id equals the id that we recieved in the body
    .increment('entries', 1) //we increment by one
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries); //this returns the entries
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage,
    handleApiCall
}