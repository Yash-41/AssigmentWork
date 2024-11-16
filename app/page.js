"use client";
import React, { useState, useEffect } from "react";

function Page() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
  });

  const [tableData, setTableData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    
    const response = await fetch("http://localhost:8000/entries");
    const data = await response.json();
    setTableData(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
  
    const { firstName, lastName, email, phone } = formData;
    return firstName && lastName && email && phone;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fill in all required fields.");
      return; 
    }

    const response = await fetch("http://localhost:8000/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const newEntry = await response.json();
    setTableData((prevData) => [...prevData, newEntry]); 
    resetForm();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (editIndex === null) return;
    if (!validateForm()) {
      alert("Please fill in all required fields.");
      return; 
    }

    const id = tableData[editIndex]._id;
    const response = await fetch(`http://localhost:8000/entries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const updatedEntry = await response.json();
    const updatedData = [...tableData];
    updatedData[editIndex] = updatedEntry;
    setTableData(updatedData); 
    resetForm();
  };

  const handleDelete = async (index) => {
    const id = tableData[index]._id;
    if (!id) return;
    await fetch(`http://localhost:8000/entries/${id}`, { method: "DELETE" });
    setTableData(tableData.filter((_, i) => i !== index)); 
  };

  const handleEdit = (index) => {
    const entry = tableData[index];
    setFormData(entry);
    setEditIndex(index);
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
    });
    setEditIndex(null);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <form className="bg-white p-6 rounded-lg shadow-md mb-10">
        <h1 className="text-2xl font-bold mb-4 text-center">Manage Entries</h1>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {["firstName", "lastName", "email", "phone", "company", "jobTitle"].map(
            (field, index) => (
              <div key={index}>
                <label
                  className="block text-gray-700 mb-1 capitalize"
                  htmlFor={field}
                >
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter ${field}`}
                  required={["firstName", "lastName", "email", "phone"].includes(
                    field
                  )}
                />
              </div>
            )
          )}
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handleCreate}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
          >
            Create
          </button>
         
          <button
            type="button"
            onClick={handleUpdate}
            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
            disabled={editIndex === null}
          >
            Update
          </button>
          
        </div>
      </form>

      {tableData.length > 0 && (
        <table className="w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              {["First Name", "Last Name", "Email", "Phone", "Company", "Job Title", "Actions"].map(
                (header, index) => (
                  <th key={index} className="px-4 py-2">
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {tableData.map((entry, index) => (
              <tr key={entry._id} className="border-t">
                {Object.keys(formData).map((key, idx) => (
                  <td key={idx} className="px-4 py-2">
                    {entry[key]}
                  </td>
                ))}
                <td className="px-4 py-2 text-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Page;
