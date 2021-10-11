const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name : {type : String, required: true},
    email : {type : String, required: true, unique: true},
    password : {type : String, required: true, minLength : 8, maxLength : 20}
},
{
    versionKey : false,
    timestamps : true
});

// create and update
userSchema.pre("save", function(next) {
    if(!this.isModified("password")) return next();

    const hash = bcryptjs.hashSync(this.password);

    this.password = hash;

    return next();

});

userSchema.methods.checkPassword = function(password) {
    const match = bcryptjs.compareSync(password, this.password);

    return match;
}

const User = mongoose.model('user', userSchema);

module.exports = User;