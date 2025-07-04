const Skill = require('../models/competence');


// creat a skill
const creatSkill = async(req, res) => {
     try {
       const {code, title, subSkillsSchema } = req.body;

       if(!code || !title || !subSkillsSchema){
        console.log('Missing required fields');
        return res.status(400).json({error: 'Tous les champs sont requis' 
        });
       }

       const skill = await Skill.create({
        code, 
        title,
        subSkillsSchema
       })

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
    

    skill.subSkillsSchema.push({
      title,
      isValid: isValid ?? true, 
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

//get all skills 

const getAllSkills = async(req, res) => {

  try {
    const skills = await Skill.find();
    res.json(skills);    
  } catch (error) {
     res.status(500).json({ message: 'error in getting  skills', error: error.message });
  } 

}

const updateSkill = async(req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if(!skill){
      return res.status(404).json({message: 'skill not found'});
    }

    const {subSkillsSchema} = req.body;

    if(subSkillsSchema) skill.subSkillsSchema = subSkillsSchema;
    // if(title) skill.title = title;

    await skill.save();

    res.json(skill);
    
  } catch (error) {
    res.status(500).json({message: 'error update skill'}) 
  }
}

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
module.exports = {creatSkill, getAllSkills, updateSkill, deleteSkill, addsubskill}