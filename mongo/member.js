let mongoose = require('mongoose');

let membersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    number_of_topics: Number,
    is_contributing: Boolean,
    created_at: Date,
    topics: Array,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            const emailRegexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            return emailRegexp.test(value);
        }
    }
});

module.exports = mongoose.model('Member', membersSchema)