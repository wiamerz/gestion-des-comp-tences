const mongoose = require('mongoose');

const subSkillsSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
     
    isValid:{
        type: Boolean,
        default: false
      },
}, {_id: false})


const skillSchema = new mongoose.Schema({
    code:{
     type: String,
     required: true

    },
    title:{
       type: String,
       required: true

    },
});

  module.exports = mongoose.model('Skill', skillSchema);  