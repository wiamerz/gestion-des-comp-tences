const Skill = require('../models/competence');

//-------------------------------skill-----------------------------------


// creat a skill
const creatSkill = async(req, res) => {
     try {
       const {code, title, subSkillsSchema } = req.body;

       if(!code || !title ){
        console.log('Missing required fields');
        return res.status(400).json({error: 'Tous les champs sont requis' 
        });
       }
       let processedSubSkills = [];
        if (subSkillsSchema && Array.isArray(subSkillsSchema)) {
          processedSubSkills = subSkillsSchema.map(subSkill => {
            if (typeof subSkill === 'string') {
              return { title: subSkill, isValid: false };
            } else if (typeof subSkill === 'object' && subSkill.title) {
              return { 
                title: subSkill.title, 
                isValid: subSkill.isValid !== undefined ? subSkill.isValid : false 
              };
            }
            return null;
          }).filter(Boolean); 
        }
       const skill = await Skill.create({
        code, 
        title,
        subSkillsSchema : processedSubSkills
       });

       console.log('skill created successfully:', skill._id);
       res.status(201).json({
        message: 'skill creat successfully',
        skill: skill
       })
     } catch (err) {
         console.error('Error creating annonce:', err);
        res.status(500).json({ error: err.message });
     }
}

//get all skills 
const getAllSkills = async(req, res) => {

  try {
    const skills = await Skill.find();
    res.json(skills);    
  } catch (error) {
     res.status(500).json({ message: 'error in getting  skills', error: error.message });
  } 

}

//update main skill
const updateSkill = async(req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if(!skill){
      return res.status(404).json({message: 'skill not found'});
    }

    const { code, title, subSkillsSchema } = req.body;
    
    if (code) skill.code = code;
    if (title) skill.title = title;
    if (subSkillsSchema) skill.subSkillsSchema = subSkillsSchema;

    await skill.save();

    res.json({
      message: 'Skill updated successfully',
      skill: skill
    });
    
  } catch (error) {
    res.status(500).json({message: 'error update skill'}) 
  }
}

// delete skill
const deleteSkill = async(req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if(!skill){
      return res.status(404).json({message: 'skill not found'});
    }
   
     res.status(200).json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({message: 'error in delete this skill'})
    
  }
}





// ------------------------------sub skill----------------------------------


// creat sub skill  par skill id 
const addsubskill = async (req, res) => {
  try {
    const { title, isValid } = req.body;
    const { skillId } = req.params;

    if (!title) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Title is required' });
    }

    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    // Fix subSkillsSchema if it's not an array
    if (!Array.isArray(skill.subSkillsSchema)) {
      skill.subSkillsSchema = [];
    }

    skill.subSkillsSchema.push({
      title,
      isValid: isValid !== undefined ? isValid : false,   
    });

    await skill.save();

    console.log('Subskill added successfully to skill:', skill._id);
    res.status(201).json({
      message: 'Subskill added successfully',
      skill: skill,
    });

  } catch (error) {
    console.error('Error adding sub-skill:', error);
    res.status(500).json({ error: error.message });
  }
};

//update sub skill
const updateSubSkill = async (req, res) => {
  try {
    const { skillId, subSkillId } = req.params;
    const { title, isValid } = req.body;
    
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    // Find subdocument by ID
    const subSkill = skill.subSkillsSchema.id(subSkillId);
    if (!subSkill) {
      return res.status(404).json({ message: 'Subskill not found' });
    }
    
    if (title !== undefined) subSkill.title = title;
    if (isValid !== undefined) subSkill.isValid = isValid;
    
    await skill.save();
    
    res.json({
      message: 'Subskill updated successfully',
      skill: skill
    });
  } catch (error) {
    console.error('Error updating subskill:', error);
    res.status(500).json({ message: 'Error updating subskill', error: error.message });
  }
};

// Delete subskill
const deleteSubSkill = async (req, res) => {
  try {
    const { skillId, subSkillId} = req.params;
    
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    if (subSkillId >= skill.subSkillsSchema.length || subSkillId < 0) {
      return res.status(400).json({ message: 'Invalid subskill index' });
    }
    
    skill.subSkillsSchema.splice(subSkillId, 1);
    
    await skill.save();
    
    res.json({
      message: 'Subskill deleted successfully',
      skill: skill
    });
  } catch (error) {
    console.error('Error deleting subskill:', error);
    res.status(500).json({ message: 'Error deleting subskill', error: error.message });
  }
};


const SubSkillValidation = async (req, res) => {
  try {
    const { skillId, subSkillId} = req.params;
    
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    if (subSkillId >= skill.subSkillsSchema.length || subSkillId < 0) {
      return res.status(400).json({ message: 'Invalid subskill index' });
    }
    
    skill.subSkillsSchema[subSkillId].isValid = !skill.subSkillsSchema[subSkillId].isValid;
    
    await skill.save();
    
    res.json({
      message: 'Subskill validation status updated',
      skill: skill
    });
  } catch (error) {
    console.error('Error toggling subskill validation:', error);
    res.status(500).json({ message: 'Error updating validation status', error: error.message });
  }
};


module.exports = {creatSkill, getAllSkills, updateSkill, updateSubSkill, deleteSkill, deleteSubSkill, addsubskill, SubSkillValidation
};