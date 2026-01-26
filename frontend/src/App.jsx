import { useState } from 'react'

function App() {
  // 1. Initialize State with your Default Data
  const [formData, setFormData] = useState({
    fullName: "Aravindh Engineer",
    email: "alice@test.com",
    phone: "555-1234",
    summary: "Passionate Java developer.",
    experience: [
      {
        company: "Google",
        position: "Software Engineer",
        duration: "2020-Present",
        description: "Building scalable microservices."
      }
    ],
    education: [
      {
        school: "MIT",
        degree: "B.Sc Computer Science",
        year: "2019"
      }
    ]
  });

  const [loading, setLoading] = useState(false);

  // Helper to handle simple text changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper to handle nested array changes (Experience/Education)
  const handleArrayChange = (index, field, value, section) => {
    const updatedSection = [...formData[section]];
    updatedSection[index][field] = value;
    setFormData({ ...formData, [section]: updatedSection });
  };

  // Add new empty item
  const addItem = (section, emptyItem) => {
    setFormData({ ...formData, [section]: [...formData[section], emptyItem] });
  };

  // Remove item
  const removeItem = (index, section) => {
    const updatedSection = [...formData[section]];
    updatedSection.splice(index, 1);
    setFormData({ ...formData, [section]: updatedSection });
  };

  // 2. The Download Function
  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData.fullName.replace(" ", "_")}_Resume.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert("Server Error: " + response.status);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to backend. Is Spring Boot running?");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-indigo-600 tracking-tight">Resume Builder</h1>
          <p className="text-gray-500 mt-2">Edit your details below and download your PDF instantly.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: FORM */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Info Card */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-600 p-1 rounded">👤</span> Personal Info
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <textarea name="summary" value={formData.summary} onChange={handleChange} placeholder="Professional Summary" rows="3" className="w-full mt-4 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
            </section>

            {/* Experience Card */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-600 p-1 rounded">💼</span> Experience
                </h2>
                <button onClick={() => addItem('experience', { company: '', position: '', duration: '', description: '' })} className="text-sm text-indigo-600 font-semibold hover:underline">+ Add Job</button>
              </div>
              
              {formData.experience.map((job, index) => (
                <div key={index} className="mb-6 pb-6 border-b border-gray-100 last:border-0 relative">
                  <button onClick={() => removeItem(index, 'experience')} className="absolute top-0 right-0 text-red-400 hover:text-red-600 text-xl font-bold">&times;</button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <input type="text" placeholder="Company" value={job.company} onChange={(e) => handleArrayChange(index, 'company', e.target.value, 'experience')} className="p-2 border rounded" />
                    <input type="text" placeholder="Position" value={job.position} onChange={(e) => handleArrayChange(index, 'position', e.target.value, 'experience')} className="p-2 border rounded" />
                  </div>
                  <input type="text" placeholder="Duration (e.g. 2020-Present)" value={job.duration} onChange={(e) => handleArrayChange(index, 'duration', e.target.value, 'experience')} className="w-full p-2 border rounded mb-2" />
                  <textarea placeholder="Description" value={job.description} onChange={(e) => handleArrayChange(index, 'description', e.target.value, 'experience')} rows="2" className="w-full p-2 border rounded"></textarea>
                </div>
              ))}
            </section>

            {/* Education Card */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="bg-green-100 text-green-600 p-1 rounded">🎓</span> Education
                </h2>
                <button onClick={() => addItem('education', { school: '', degree: '', year: '' })} className="text-sm text-indigo-600 font-semibold hover:underline">+ Add School</button>
              </div>

              {formData.education.map((edu, index) => (
                <div key={index} className="mb-4 pb-4 border-b border-gray-100 last:border-0 relative">
                   <button onClick={() => removeItem(index, 'education')} className="absolute top-0 right-0 text-red-400 hover:text-red-600 text-xl font-bold">&times;</button>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="School" value={edu.school} onChange={(e) => handleArrayChange(index, 'school', e.target.value, 'education')} className="p-2 border rounded" />
                    <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => handleArrayChange(index, 'degree', e.target.value, 'education')} className="p-2 border rounded" />
                    <input type="text" placeholder="Year" value={edu.year} onChange={(e) => handleArrayChange(index, 'year', e.target.value, 'education')} className="p-2 border rounded" />
                   </div>
                </div>
              ))}
            </section>
          </div>

          {/* RIGHT COLUMN: PREVIEW & ACTIONS */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              
              {/* Action Card */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 text-center">
                <h3 className="text-lg font-bold text-gray-700 mb-4">Ready to Export?</h3>
                <button 
                  onClick={handleDownload} 
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-lg text-white font-bold text-lg shadow-md transition-all 
                    ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 hover:shadow-lg transform hover:-translate-y-1'}`}
                >
                  {loading ? 'Generating...' : 'Download PDF ⬇'}
                </button>
              </div>

              {/* Live Preview (Simple JSON View) */}
              <div className="bg-gray-800 p-4 rounded-xl shadow-inner text-xs text-gray-300 overflow-auto max-h-96">
                <p className="mb-2 font-bold text-gray-400 uppercase tracking-wider">Live Data Preview</p>
                <pre>{JSON.stringify(formData, null, 2)}</pre>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default App