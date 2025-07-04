const express = require('express');
const router = express.Router();
const{creatSkill, getAllSkills, updateSkill, deleteSkill} = require('../controllers/competencecontrollers');

router.post('/add', creatSkill);
router.get('/get', getAllSkills);
router.put('/update/:id', updateSkill);
router.delete('/delete/:id', deleteSkill);


module.exports = router;