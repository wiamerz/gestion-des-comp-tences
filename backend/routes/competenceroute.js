const express = require('express');
const router = express.Router();
const {creatSkill, getAllSkills, updateSkill, updateSubSkill, deleteSkill, deleteSubSkill, addsubskill, SubSkillValidation} = require('../controllers/competencecontrollers'); 

//skill
router.post('/add', creatSkill);
router.get('/get', getAllSkills);
router.put('/edit/:id', updateSkill);
router.delete('/delete/:id', deleteSkill);

// sub skill
router.post('/:skillId/subskill', addsubskill)
router.put('/:skillId/subskill/:subSkillId', updateSubSkill);
router.delete('/:skillId/subskill/:subSkillId', deleteSubSkill);
router.put('/:skillId/subskill/:subSkillId/toggle', SubSkillValidation);

module.exports = router;