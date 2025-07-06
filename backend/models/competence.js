const mongoose = require('mongoose');

const subSkillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'valid', 'invalid'],
    default: 'pending'
  }
}); 

const skillSchema = new mongoose.Schema({
    code:{
     type: String,
     required: true

    },
    title:{
       type: String,
       required: true

    },
   subSkillsSchema: {
    type: [subSkillSchema],
    default: []
  }
});

  module.exports = mongoose.model('Skill', skillSchema); 