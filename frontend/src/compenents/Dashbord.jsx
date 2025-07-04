import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import Footer from './Footer';
import { BadgeCheck, XCircle, Plus } from 'lucide-react';

const Dashboard = () => {
  const [skills, setSkills] = useState([]);
  const [formDatat, setFormData] = useState({
     
  })

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/skill/get');
        setSkills(res.data);
      } catch (error) {
        console.log("Error in getting skills", error);
      }
    };
    fetchSkills();
  }, []);

  const addskill = async() => {
    try {
       const data = await axios.post('http://localhost:5000/api/skill/add');
     
        
    } catch (error) {
        
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
            <div className='flex justify-between items-center'>
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Your Skills</h2> 
              <Plus 
              
              className="text-2xl font-bold rounded-2xl text-gray-50 mb-8 bg-gray-800 hover:bg-gray-600" />
              </div>
          

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
                  <div className="text-lg font-semibold text-black-600">{skill.code}</div>
                  <div className="text-sm text-gray-700">{skill.title}</div>

                  {skill.subSkillsSchema && (
                    <>
                      <div className="text-sm text-gray-600 font-medium">
                        Sub Skill: {skill.subSkillsSchema.title}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {skill.subSkillsSchema.isValid ? (
                          <>
                            <BadgeCheck className="w-4 h-4 text-green-500" />
                            <span className="text-green-600">Valid</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span className="text-red-600">Invalid</span>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
