const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Role = new Schema({
    name : {
        type: String,
        required: true,
        unique: true
    },
    permission: {
        type: [String]
    },
    displayName: {
        type: String,
        requried: true
    },
    IsSystem : {
        type: Boolean,
        default:false 
    },
    description: String
})
const RoleModel = mongoose.model("Role", Role);
module.exports = RoleModel;