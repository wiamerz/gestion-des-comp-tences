const express = require('express');
const router = express.Router();
const{creatSkill, getAllSkills, updateSkill} = require('../controllers/competencecontrollers');

router.post('/add', creatSkill);
router.get('/get', getAllSkills);
router.put('/update/:id', updateSkill);


module.exports = router;