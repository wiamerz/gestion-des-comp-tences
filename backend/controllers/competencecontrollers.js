const Skill = require('../models/competence');


// creat a skill
const creatSkill = async(req, res) => {
     try {

       const {code, title } = req.body;

       if(!code || !title){
        console.log('Missing required fields');
        return res.status(400).json({error: 'Les champs startPoint, capacity et date sont requis' 
        });
       }

       const skill = await Skill.create({
        code, 
        title
       })

       console.log('skill created successfully:', skill._id);
       res.status(201).json({
        message: 'skill crat successfully',
        skill: skill
       })
     } catch (err) {
         console.error('Error creating annonce:', err);
        res.status(500).json({ error: err.message });
     }
}

//get all skills 

module.exports = {creatSkill}