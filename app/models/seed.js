
const mongoose = require('mongoose')
const Sayan = require('./sayan')
const db = require('../../config/db')

const startSayans = [
    { name: 'Goku', type: 'Sayan', age: 30, strong: true},
    { name: 'Gohan', type: 'Sayan', age: 15, strong: true},
    { name: 'Freeza', type: 'ALien', age: 35, strong: true},
    { name: ' Vegeta', type: 'Sayan', age: 33, strong: true}
]

// first we need to connect to the database
mongoose.connect(db, {
    useNewUrlParser: true
})
    .then(() => {
        
        Sayan.deleteMany({ owner: null })
            .then(deletedSayan => {
                console.log('deletedSayan', deletedSayan)

                Sayan.create(startSayans)
                    .then(newSayan => {
                        console.log('the new sayan', newSayan)
                        mongoose.connection.close()
                    })
                    .catch(error => {
                        console.log(error)
                        mongoose.connection.close()
                    })
            })
            .catch(error => {
                console.log(error)
                mongoose.connection.close()
            })
    })
    .catch(error => {
        console.log(error)
        mongoose.connection.close()
    })



//     //echo "# dragonball-API" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/RickBrazAbreu/dragonball-API.git
// git push -u origin main