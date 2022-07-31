const express = require('express')
const passport = require('passport')

// pull in Mongoose model for sayans
const Sayan = require('../models/sayan')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// ROUTES GO HERE
// we only need three, and we want to set them up using the same conventions as our other routes, which means we might need to refer to those other files to make sure we're using our middleware correctly

// POST -> create a weapon
// POST /weapons/<sayan_id>
router.post('/weapons/:sayanId', removeBlanks, (req, res, next) => {
    // get our weapon from req.body
    const weapon = req.body.weapon
    // get our sayan's id from req.params.sayanId
    const sayanId = req.params.sayanId
    // find the sayan
    Sayan.findById(sayanId)
        .then(handle404)
        .then(sayan => {
            console.log('this is the sayan', sayan)
            console.log('this is the weapon', weapon)

            // push the weapon into the sayan's weapons array
            sayan.weapons.push(weapon)

            // save the sayan
            return sayan.save()
            
        })
        // send the newly updated sayan as json
        .then(sayan => res.status(201).json({ sayan: sayan }))
        .catch(next)
})

// UPDATE a weapon
// PATCH /weapons/<sayan_id>/<weapon_id>
router.patch('/weapons/:sayanId/:weaponId', requireToken, removeBlanks, (req, res, next) => {
    // get the weapon and the sayan ids saved to variables
    const sayanId = req.params.sayanId
    const weaponId = req.params.weaponId

    // find our sayan
    Sayan.findById(sayanId)
        .then(handle404)
        .then(sayan => {
            // single out the weapon (.id is a subdoc method to find something in an array of subdocs)
            const theWeapon = sayan.weapons.id(weaponId)
            // make sure the user sending the request is the owner
            requireOwnership(req, sayan)
            // usayanpdate the weapon with a subdocument method
            theWeapon.set(req.body.weapon)
            // return the saved sayan
            return sayan.save()
        })
        .then(() => res.sendStatus(204))
        .catch(next)
})

// DELETE a weapon
// DELETE /weapons/<sayan_id>/<weapon_id>
router.delete('/weapons/:sayanId/:weaponId', requireToken, (req, res, next) => {
    // get the weapon and the sayan ids saved to variables
    const sayanId = req.params.sayanId
    const weaponId = req.params.weaponId
    // then we find the sayan
    Sayan.find(sayanId)
        // handle a 404
        .then(handle404)
        // do stuff with the weapon(in this case, delete it)
        .then(sayan => {
            // we can get the subdoc the same way as update
            const theWeapon = sayan.weapons.id(weaponId)
            // require that the user deleting this weapon is the sayan's owner
            requireOwnership(req, sayan)
            // call remove on the subdoc
            theWeapon.remove()

            // return the saved sayan
            return sayan.save()
        })
        // send 204 no content status
        .then(() => res.sendStatus(204))
        // handle errors
        .catch(next)
})

// export the router
module.exports = router