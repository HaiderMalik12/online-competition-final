var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var Schema = mongoose.Schema;


var User = new Schema({
    local: {
        email: String,
        password: String,
        category: String,
        name: String,
        img:String,
        occupation:String
    }
});

User.methods.hashPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

User.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};
User.methods.validateCategory = function (category) {

    return this.category;
};
module.exports = mongoose.model("User", User);