const mongoose = require('mongoose')
const conf = require('config')

function startUp() {
    const host = conf.get('database.host')
    const dbName = conf.get('database.name')

    mongoose.connect(`mongodb://${host}/${dbName}`, {useNewUrlParser: true})
        .then(() => console.log('connected to mongo db'))
        .catch((err) => console.error('Could not connect to the database', err))
}


module.exports.start = startUp