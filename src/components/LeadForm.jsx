// Import necessary React hooks and API functions
import React, { useState, useEffect } from "react";
import { createLead, updateLead } from "../services/api"; // API functions for creating/updating leads

/**
 * LeadForm Component
 * 
 * Displays a form for creating or editing a lead.
 * 
 * Props:
 * - `lead`: If provided, the form will be in "Edit" mode with the lead's data.
 * - `onSuccess`: Function to notify the parent component that a lead was successfully added/updated.
 * - `onCancel`: Function to reset the form to "Create" mode when canceling an edit.
 */
const LeadForm = ({ lead, onSuccess, onCancel }) => {
  /**
   * State to manage form data.
   * If `lead` is provided (edit mode), this will be updated accordingly.
   * Otherwise, it starts with an empty form (create mode).
   */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "New", // Default status
	priority: "Medium",
    notes: "",
  });

  /**
   * State to store validation or API error messages.
   */
  const [error, setError] = useState("");

  /**
   * useEffect Hook: Runs when the `lead` prop changes.
   * - If a lead is provided, populates the form with its details (Edit Mode).
   * - If no lead is provided, resets the form to default values (Create Mode).
   */
  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        status: lead.status || "New",
		priority: lead.priority || "Medium",
        notes: lead.notes || "",
        id: lead.id || null, // Only present in Edit Mode
      });
    } else {
      setFormData({ name: "", email: "", phone: "", status: "New", priority: "Medium", notes: "" });
    }
  }, [lead]);

  /**
   * Handles form input changes.
   * Updates the `formData` state when a user types into the input fields.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Handles form submission (create or update a lead).
   * - Determines if we're creating or updating based on `formData.id`.
   * - Calls the appropriate API function (`createLead` or `updateLead`).
   * - If successful, resets the form and notifies the parent component.
   * - If an error occurs, sets an error message.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear previous error messages

    // Determine whether to create a new lead or update an existing one
    const apiCall = formData.id ? updateLead : createLead;

    apiCall(formData)
      .then(() => {
        alert(formData.id ? "Lead updated successfully!" : "Lead created successfully!");
        onSuccess(); // Notify parent to refresh the leads list
        setFormData({ name: "", email: "", phone: "", status: "New", priority: "Medium", notes: "" }); // Reset form
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          setError(err.response.data); // Set error message from API response
        } else {
          setError("Failed to save lead. Please try again.");
        }
      });
  };

  return (
    <div className="p-4 border rounded-md shadow-md">
      {/* Form title changes dynamically based on whether it's in Create or Edit mode */}
      <h2 className="text-xl font-bold mb-4">{formData.id ? "Edit Lead" : "Add New Lead"}</h2>

      {/* Display error message if any */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Lead Form */}
      <form onSubmit={handleSubmit}>
        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        {/* Phone Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {/* Status Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
		{/* Priority Dropdown */}
		<div className="mb-4">
          <label className="block text-sm font-medium mb-2">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>

          </select>
        </div>
		
        {/* Notes Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            rows="4"
          />
        </div>

        {/* Form Action Buttons (Submit & Cancel) */}
        <div className="flex space-x-4">
          {/* Submit Button - Label changes dynamically */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {formData.id ? "Update Lead" : "Submit"}
          </button>

          {/* Cancel Button (Only visible in Edit Mode) */}
          {formData.id && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// Export the LeadForm component for use in LeadsPage
export default LeadForm;
