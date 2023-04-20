const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const thoughtSchema = new Schema(

);

const Thought = model('thought', thoughtSchema);

module.exports = Thought;