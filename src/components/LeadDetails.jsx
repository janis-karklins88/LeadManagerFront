// LeadDetails.jsx
import React, { useEffect, useState } from "react";
import { getActivities, addActivity, deleteActivity } from "../services/api";
import { format } from 'date-fns';


const LeadDetails = ({ lead, onClose }) => {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({ description: "", type: "", date: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchActivities();
  }, [lead.id]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await getActivities(lead.id);
      setActivities(response.data);
    } catch (err) {
      setError("Failed to load activities.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async () => {
    try {
      if (!newActivity.description || !newActivity.type || !newActivity.date) {
        setError("Please fill in all fields.");
        return;
      }

      const formattedDate = newActivity.date.includes("T")
        ? newActivity.date
        : `${newActivity.date}T00:00:00`;

      await addActivity(lead.id, { ...newActivity, date: formattedDate });
      setNewActivity({ description: "", type: "", date: "" });
      fetchActivities();
    } catch (err) {
      setError("Failed to add activity.");
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      await deleteActivity(activityId);
      fetchActivities();
    } catch (err) {
      setError("Failed to delete activity.");
    }
  };

  return (
      <div className="relative">
      <h3 className="flex items-center w-full text-xl font-bold mb-4">
  <span>{lead.name}</span>
  {/* close button */}
  <button
  onClick={onClose}
  className="ml-2 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-1 rounded-full focus:outline-none"
  aria-label="Close Lead Details"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
</button>
</h3>






{error && <p className="text-red-500 mb-2">{error}</p>}

{loading ? (
  <p>Loading activities...</p>
) : (
  <table className="w-full mb-4 border-collapse">
    <thead>
      <tr>
        
        <th className="border px-2 py-1">Type</th>
		<th className="border px-2 py-1">Description</th>
        <th className="border px-2 py-1">Date</th>
        <th className="border px-2 py-1">Actions</th>
      </tr>
    </thead>
    <tbody>
      {activities.map((activity) => (
        <tr key={activity.id} className="hover:bg-gray-50">
          
          <td className="border px-2 py-1">{activity.type}</td>
		  <td className="border px-2 py-1">{activity.description}</td>
          <td className="border px-2 py-1">
          {activity.date ? format(new Date(activity.date), "MMM d, yyyy, h:mm a") : "—"}
        </td>
          <td className="border px-2 py-1 text-center">
            <button
              onClick={() => handleDeleteActivity(activity.id)}
              className="text-red-500 font-medium px-1 py-0 rounded hover:bg-red-50 focus:outline-none"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}

		
		{/* Add activity */}
      <h4 className="font-bold mb-2">Add Activity</h4>
	  <input
        type="text"
        placeholder="Type (meeting, calls, etc)"
        value={newActivity.type}
        onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
        className="border rounded px-2 py-1 mb-2 w-full"
      />
	  
      <input
        type="text"
        placeholder="Description"
        value={newActivity.description}
        onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
        className="border rounded px-2 py-1 mb-2 w-full"
      />
      
      <input
        type="datetime-local"
        name="date"
        value={newActivity.date}
        onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
        className="border rounded px-2 py-1 mb-2 w-full"
      />
      <button onClick={handleAddActivity} className="bg-blue-500 text-white px-4 py-2 rounded active:bg-blue-700 active:scale-95 transition transform duration-150 w-full">
        Add Activity
      </button>
    </div>
  );
};

export default LeadDetails;
