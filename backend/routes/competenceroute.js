const express = require('express');
const router = express.Router();
const{creatSkill} = require('../controllers/competencecontrollers');

router.post('/add', creatSkill);

module.exports = router;