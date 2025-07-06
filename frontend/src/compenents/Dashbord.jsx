import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import Footer from './Footer';
import { BadgeCheck, XCircle, Clock, Plus, Trash, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [skills, setSkills] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    subSkillsSchema: [],
  });
  const [error, setError] = useState("");


//get skills
  const fetchSkills = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/skill/get');
      setSkills(res.data);
    } catch (error) {
      console.log("Error in getting skills", error);
      setError("Failed to load skills");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

// add skills
  const addskill = async (skillData) => {
    try {
      const transformedData = {
        ...skillData,
        subSkillsSchema: skillData.subSkillsSchema.map(title => ({ title, status: 'pending' }))
      };
      
      const response = await axios.post('http://localhost:5000/api/skill/add', transformedData);
      console.log("Skill data created successfully", response.data);
      return response.data;
    } catch (error) {
      console.log("Error creating skill:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to create skill");
      throw error;
    }
  };

//update skill
  const updateSkill = async (skillId, skillData) => {
    try {
      const transformedData = {
        ...skillData,
        subSkillsSchema: skillData.subSkillsSchema.map(title => ({ title, status: 'pending' }))
      };
      
      const response = await axios.put(`http://localhost:5000/api/skill/edit/${skillId}`, transformedData);
      console.log("Skill updated successfully", response.data);
      return response.data;
    } catch (error) {
      console.log("Error updating skill:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to update skill");
      throw error;
    }
  };

  const handleSubSkillsChange = (e, index) => {
    const updated = [...formData.subSkillsSchema];
    updated[index] = e.target.value;
    setFormData({ ...formData, subSkillsSchema: updated });
  };

//add subskill
  const addSubSkill = () => {
    setFormData({ ...formData, subSkillsSchema: [...formData.subSkillsSchema, ""] });
  };

//delete sub skill
  const removeSubSkill = (index) => {
    const updated = formData.subSkillsSchema.filter((_, i) => i !== index);
    setFormData({ ...formData, subSkillsSchema: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.code || !formData.title) {
        setError("Code and Title are required");
        return;
      }
      
      if (editMode) {
        await updateSkill(editingSkillId, formData);
        toast.success("Skill updated successfully");
      } else {
        await addskill(formData);
        toast.success("Skill created successfully");
      }
      
      await fetchSkills();
      closeModal();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditMode(false);
    setEditingSkillId(null);
    setFormData({ code: "", title: "", subSkillsSchema: [] });
    setError("");
  };

  const openEditModal = (skill) => {
    setEditMode(true);
    setEditingSkillId(skill._id);
    setFormData({
      code: skill.code,
      title: skill.title,
      subSkillsSchema: skill.subSkillsSchema.map(sub => sub.title)
    });
    setOpenModal(true);
  };

  const deleteskill = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/skill/delete/${id}`);
      toast.success("The skill deleted successfully");
      await fetchSkills();
    } catch (error) {
      toast.error("There is an error in deleting this skill");
      console.log("There is an error in deleting this skill", error);
    }
  };

  // Helper function to get status display info
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'valid':
        return {
          icon: <BadgeCheck className="w-3 h-3 text-green-500" />,
          text: 'Valid',
          textColor: 'text-green-600',
          bgColor: 'bg-green-50'
        };
      case 'invalid':
        return {
          icon: <XCircle className="w-3 h-3 text-red-500" />,
          text: 'Invalid',
          textColor: 'text-red-600',
          bgColor: 'bg-red-50'
        };
      case 'pending':
      default:
        return {
          icon: <Clock className="w-3 h-3 text-yellow-500" />,
          text: 'Pending',
          textColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50'
        };
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className='flex justify-between items-center'>
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Your Skills</h2> 
            <button 
              onClick={() => setOpenModal(true)} 
              className="flex items-center justify-center p-2 rounded-full text-gray-50 bg-gray-800 hover:bg-gray-600 transition-colors"
              aria-label="Add new skill"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          {skills.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
              You don't have any skills yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill) => (
                <div
                  key={skill._id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-5 space-y-2 border border-gray-100"
                >
                  <div className="flex justify-end gap-2 mb-2">
                    <button 
                      onClick={() => openEditModal(skill)}
                      className="flex items-center justify-center p-2 rounded-full text-gray-50 bg-[rgb(11,17,41)] hover:bg-blue-900 transition-colors"
                      aria-label="Edit skill"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteskill(skill._id)}
                      className="flex items-center justify-center p-2 rounded-full text-gray-50 bg-red-600 hover:bg-red-700 transition-colors"
                      aria-label="Delete skill"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="text-lg font-semibold text-gray-800">{skill.code}</div>
                  <div className="text-sm text-gray-700">{skill.title}</div>

                  {skill.subSkillsSchema && skill.subSkillsSchema.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <h4 className="text-sm font-medium text-gray-600">Sub-Skills:</h4>
                      {skill.subSkillsSchema.map((subSkill, index) => {
                        const statusInfo = getStatusDisplay(subSkill.status);
                        return (
                          <div key={index} className="pl-2 border-l-2 border-gray-200">
                            <div className="text-sm text-gray-700">{subSkill.title}</div>
                            <div className={`flex items-center gap-2 text-xs mt-1 px-2 py-1 rounded-full ${statusInfo.bgColor} w-fit`}>
                              {statusInfo.icon}
                              <span className={statusInfo.textColor}>{statusInfo.text}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {openModal && ( 
          <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={closeModal}
              >
                <XCircle />
              </button>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <h3 className="text-xl font-semibold text-gray-700">
                  {editMode ? 'Edit Skill' : 'Add New Skill'}
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code*</label>
                  <input
                    name="code"
                    placeholder="C1, C2 ..."
                    onChange={handleChange}
                    value={formData.code}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                  <input
                    name="title"
                    placeholder="Skill title"
                    onChange={handleChange}
                    value={formData.title}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Sub-Skills</label>
                  {formData.subSkillsSchema.map((sub, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        placeholder={`Sub-skill ${index + 1}`}
                        value={sub}
                        onChange={(e) => handleSubSkillsChange(e, index)}
                        className="flex-1 border px-3 py-2 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeSubSkill(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSubSkill}
                    className="text-blue-600 font-semibold text-sm flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Sub-Skill
                  </button>
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <button
                  type="submit"
                  className="bg-[rgb(11,17,41)] hover:bg-[rgb(20, 36, 99)] text-white px-4 py-2 rounded w-full mt-4"
                >
                  {editMode ? 'Update Skill' : 'Create Skill'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;