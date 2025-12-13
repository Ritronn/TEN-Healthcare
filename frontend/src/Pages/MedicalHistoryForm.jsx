import React, { useState, useEffect } from "react";

export default function MedicalHistoryForm() {
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    chiefComplaint: "",
    allergies: "",
    medications: "",
    pastHistory: "",
    familyHistory: "",
    socialHistory: "",
    immunizations: "",
    consent: false,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email) {
      setForm(prev => ({ ...prev, email: user.email }));
    }
  }, []);

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.dob) newErrors.dob = "Date of birth is required";
    if (!form.chiefComplaint.trim())
      newErrors.chiefComplaint = "Chief complaint is required";
    if (!form.consent)
      newErrors.consent = "You must give consent before submitting";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setErrors({ submit: 'Please login first' });
          return;
        }

        const response = await fetch('http://localhost:5000/api/auth/medical-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(form)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to save medical history');
        }

        setSubmitted(true);
        localStorage.removeItem('isNewUser');
        setTimeout(() => {
          window.location.href = '/patient/dash';
        }, 2000);
      } catch (error) {
        setErrors({ submit: error.message });
        setSubmitted(false);
      }
    } else {
      setSubmitted(false);
    }
  };

  const handleReset = () => {
    setForm({
      fullName: "",
      dob: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
      chiefComplaint: "",
      allergies: "",
      medications: "",
      pastHistory: "",
      familyHistory: "",
      socialHistory: "",
      immunizations: "",
      consent: false,
    });
    setErrors({});
    setSubmitted(false);
  };

  return (
     <div className="min-h-screen w-full relative">
        {/* Azure Depths */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "white",
          }}
        />
        {/* Your Content/Components */}
          <div className="min-h-screen flex justify-center items-start py-10 px-4 sm:px-6" style={{ background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f9f0 100%)' }}>
      <div className="w-full max-w-4xl bg-white/95 shadow-lg rounded-lg p-6 sm:p-8 backdrop-blur-md">
        <h2 className="text-2xl sm:text-3xl font-serif mb-6 text-center" style={{ color: '#059669' }}>
          🩺 Patient Medical History Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* PERSONAL INFO */}
          <section>
            <h3 className="text-lg font-semibold mb-3 border-b pb-1 text-gray-300">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                />
                {errors.dob && (
                  <p className="text-red-500 text-sm">{errors.dob}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  readOnly
                  className="w-full mt-1 border rounded-md p-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                  placeholder="Email from registration"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-400">
                  Address
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full mt-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full address"
                ></textarea>
              </div>
            </div>
          </section>

          {/* MEDICAL INFO */}
          <section>
            <h3 className="text-lg font-semibold mb-3 border-b pb-1 text-gray-300">
              Medical Information
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Chief Complaint *
                </label>
                <input
                  type="text"
                  name="chiefComplaint"
                  value={form.chiefComplaint}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Headache, fever, stomach pain..."
                />
                {errors.chiefComplaint && (
                  <p className="text-red-500 text-sm">{errors.chiefComplaint}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Current Medications
                </label>
                <textarea
                  name="medications"
                  value={form.medications}
                  onChange={handleChange}
                  rows="2"
                  className="w-full mt-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="List medicines with doses"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Allergies
                </label>
                <input
                  type="text"
                  name="allergies"
                  value={form.allergies}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Penicillin, Dust, Pollen..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Past Medical / Surgical History
                </label>
                <textarea
                  name="pastHistory"
                  value={form.pastHistory}
                  onChange={handleChange}
                  rows="2"
                  className="w-full mt-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Diabetes, Appendectomy (2020)"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Family History
                </label>
                <textarea
                  name="familyHistory"
                  value={form.familyHistory}
                  onChange={handleChange}
                  rows="2"
                  className="w-full mt-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Mother - Diabetes, Father - Hypertension"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Social History
                </label>
                <textarea
                  name="socialHistory"
                  value={form.socialHistory}
                  onChange={handleChange}
                  rows="2"
                  className="w-full mt-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Smoking, alcohol, occupation, exercise habits"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Immunizations
                </label>
                <input
                  type="text"
                  name="immunizations"
                  value={form.immunizations}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. COVID-19 (2022), Tetanus (2023)"
                />
              </div>
            </div>
          </section>

          {/* CONSENT */}
          <section className="border-t pt-4">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                name="consent"
                checked={form.consent}
                onChange={handleChange}
                className="mt-1 accent-blue-500"
              />
              <span className="text-sm text-gray-400">
                I confirm that the above information is accurate and I consent
                to its use for medical purposes.
              </span>
            </label>
            {errors.consent && (
              <p className="text-red-500 text-sm">{errors.consent}</p>
            )}
            {errors.submit && (
              <p className="text-red-500 text-sm">{errors.submit}</p>
            )}
          </section>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-200 hover:bg-gray-300 text-gray-400 px-4 py-2 rounded-md w-full sm:w-auto"
            >
              Reset
            </button>
            <button
              type="submit"
              className="text-white px-4 py-2 rounded-md w-full sm:w-auto"
              style={{ backgroundColor: '#059669' }}
            >
              Submit
            </button>
          </div>
        </form>

        {/* SUCCESS MESSAGE */}
        {submitted && (
          <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-md">
            <h3 className="font-semibold text-green-700">
              ✅ Medical History Saved Successfully!
            </h3>
            <p className="text-green-600 text-sm mt-1">Redirecting to dashboard...</p>
          </div>
        )}
      </div>
    </div>
      </div>
    
  );
}