// Import necessary React hooks and components
import React, { useState } from "react";
import LeadsTable from "../components/LeadsTable"; // Table that displays the leads
import LeadForm from "../components/LeadForm"; // Form to add/edit a lead
import { deleteLead } from "../services/api"; // API function to delete a lead
import { useNavigate } from "react-router-dom"; // For redirection after logout
import { useAuth } from "../context/AuthContext";

// Main page component that manages leads
const LeadsPage = () => {
  // State to trigger table reload when a lead is modified
  const [reloadTable, setReloadTable] = useState(false);
  // Holds the lead that is currently being edited (or null for create)
  const [selectedLead, setSelectedLead] = useState(null);
  // Controls whether the form is visible
  const [showForm, setShowForm] = useState(false);

  /**
   * Callback function to handle successful form submission (creating/updating a lead).
   * - Reloads the table by toggling `reloadTable`
   * - Clears the `selectedLead` state to reset the form
   */
  const handleFormSuccess = () => {
    setReloadTable(!reloadTable); // Triggers table data reload
    setSelectedLead(null); // Reset form to default (Create Mode)
	setShowForm(false); // Hide form after successful create/update
  };

  /**
   * Handles when the "Edit" button is clicked in the table.
   * - Stores the selected lead's data in state.
   * - This will populate the form with the lead's details.
   * @param {Object} lead - The lead to be edited
   */
  const handleEdit = (lead) => {
    setSelectedLead(lead);
	setShowForm(true);
  };
  
  

  /**
   * Handles canceling an edit action.
   * - Clears the selected lead, resetting the form to "Create Lead" mode.
   */
    const handleCancel = () => {
    setSelectedLead(null);
	setShowForm(false);
  };
  
  //handle add new Lead
  const handleAddNew = () => {
    setSelectedLead(null); // No lead means "create mode"
    setShowForm(true);
  };
  
   //loging out
   const navigate = useNavigate(); // To navigate after logout
   const { logout } = useAuth();
   /**
   * Handles user logout.
   * - Removes the JWT token from localStorage.
   * - Redirects to the login page.
   */
  const handleLogout = () => {
    logout();
	navigate("/login");
  }
   
 

  /**
   * Handles deleting a lead.
   * - Prompts the user for confirmation before deleting.
   * - Calls the `deleteLead` API function.
   * - If successful, it reloads the table.
   * @param {number} id - The ID of the lead to be deleted
   */
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      deleteLead(id)
        .then(() => {
          
          setReloadTable(!reloadTable); // Reload the table after deletion
        })
        .catch((error) => {
          console.error("Error deleting lead:", error);
          alert("Failed to delete lead.");
        });
    }
  };

  /**
   * Renders the Leads Management page, containing:
   * - The `LeadForm` component for adding or editing leads.
   * - The `LeadsTable` component for displaying and managing leads.
   */
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Leads Management</h1>
	  {/*Add leads and Logout buttons*/}
	  <div className="flex justify-end space-x-4 mb-4">
  <button
    onClick={handleAddNew}
    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 active:bg-blue-700 active:scale-95 transition transform duration-150 focus:outline-none"
  >
    Add New Lead
  </button>
  <button
  onClick={handleLogout}
  className="bg-red-300 text-grey px-3 py-1 rounded hover:bg-red-400 focus:outline-none"
>
  Logout
</button>
</div>

	  
      
	  

      {/* Conditionally render the LeadForm only when showForm is true */}
      {showForm && (
        <LeadForm
          lead={selectedLead}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      )}

      {/* The table displaying all leads */}
      <LeadsTable onEdit={handleEdit} onDelete={handleDelete} reloadTable={reloadTable} />
    </div>
  );
};

export default LeadsPage;
