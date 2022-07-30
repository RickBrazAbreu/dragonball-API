
const mongoose = require('mongoose')

const toySchema = require('./weapons')

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
        adoptable: {
            type: Boolean,
            required: true
        },
        toys: [toySchema],
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

sayanSchema.virtual('isABaby').get(function () {
    if (this.age < 10) {
        return "he is a kid"
    } else if (this.age >= 10 && this.age < 20) {
        return "he is a teenager"
    } else {
        return "more old more estrong sayan is"
    }
})

module.exports = model('Sayan', sayanSchema)