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
              return { title: subSkill, status: 'pending' };
            } else if (typeof subSkill === 'object' && subSkill.title) {
              return { 
                title: subSkill.title, 
                status: subSkill.status || 'pending'
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

//update  skill
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
    const { title, status } = req.body;
    const { skillId } = req.params;

    if (!title) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Title is required' });
    }

    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    if (!Array.isArray(skill.subSkillsSchema)) {
      skill.subSkillsSchema = [];
    }

    skill.subSkillsSchema.push({
      title,
      status: status || 'pending',   
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
    const { title, status } = req.body;
    
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
    if (status !== undefined) subSkill.status = status;
    
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
    const { status } = req.body;
    
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    if (subSkillId >= skill.subSkillsSchema.length || subSkillId < 0) {
      return res.status(400).json({ message: 'Invalid subskill index' });
    }
    
    if (status && ['pending', 'valid', 'invalid'].includes(status)) {
      skill.subSkillsSchema[subSkillId].status = status;
    } else {
      const currentStatus = skill.subSkillsSchema[subSkillId].status;
      if (currentStatus === 'pending') {
        skill.subSkillsSchema[subSkillId].status = 'valid';
      } else if (currentStatus === 'valid') {
        skill.subSkillsSchema[subSkillId].status = 'invalid';
      } else {
        skill.subSkillsSchema[subSkillId].status = 'pending';
      }
    }
    
    await skill.save();
    
    res.json({
      message: 'Subskill status updated successfully',
      skill: skill
    });
  } catch (error) {
    console.error('Error updating subskill status:', error);
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};


module.exports = {creatSkill, getAllSkills, updateSkill, updateSubSkill, deleteSkill, deleteSubSkill, addsubskill, SubSkillValidation
};