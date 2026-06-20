const mongoose = require('mongoose')
const { date } = require('zod')


const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [ true, "token is required to be added in blacklist" ]
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:"1d"
    }
});

const tokenBlacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema)


module.exports = tokenBlacklistModel