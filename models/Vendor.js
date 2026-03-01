const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Vendor = new Schema ({
    name:{
        type : String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    Phone: String,
    category : String,
    status:{
        type: String,
        enum: [" active","inactive", "pending","blacklisted"],
        default: "pending"
    },
    document:{
        name: {
            type: String,
            required: true
        },
        url:{String},
        uploadedAt:{
            type:Date,
            default: Date.now
        }
    },
    riskscore:{
        type: Number,
         default: 0
    },
    risksummary: String,
    totalOrders:{
        type: Number,
        default: 0
    },
    totalValue:{
        type:Number,
        default: 0
    },
    createdby:{
        type: Schema.type.ObjectId, 
        ref: "User"
    }
},{timestamps:true})
const VendorModel = mongoose.model ("Vendor",Vendor);
module.exports = VendorModel;
