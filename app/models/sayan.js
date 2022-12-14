
const mongoose = require('mongoose')

const weaponSchema = require('./weapons')

const { Schema, model } = mongoose

const sayanSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        strong: {
            type: Boolean,
            required: true
        },
        weapons: [weaponSchema],
        owner: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
    }, {
        timestamps: true,

        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
)


sayanSchema.virtual('fullTitle').get(function () {
    
    return `${this.name} the ${this.type}`
})

sayanSchema.virtual('isaKid').get(function () {
    if (this.age < 10) {
        return "he is a kid"
    } else if (this.age >= 10 && this.age < 20) {
        return "he is a teenager"
    } else {
        return "more old more estrong sayan is"
    }
})

module.exports = model('Sayan', sayanSchema)