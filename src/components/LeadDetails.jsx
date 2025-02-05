// LeadDetails.jsx
import React, { useEffect, useState } from "react";
import { getActivities, addActivity, deleteActivity } from "../services/api";

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
  <span>Lead Details: {lead.name}</span>
  <button onClick={onClose} className="ml-4 text-gray-500">X</button>
</h3>






{error && <p className="text-red-500 mb-2">{error}</p>}

{loading ? (
  <p>Loading activities...</p>
) : (
  <table className="w-full mb-4 border-collapse">
    <thead>
      <tr>
        <th className="border px-2 py-1">Description</th>
        <th className="border px-2 py-1">Type</th>
        <th className="border px-2 py-1">Date</th>
        <th className="border px-2 py-1">Actions</th>
      </tr>
    </thead>
    <tbody>
      {activities.map((activity) => (
        <tr key={activity.id} className="hover:bg-gray-50">
          <td className="border px-2 py-1">{activity.description}</td>
          <td className="border px-2 py-1">{activity.type}</td>
          <td className="border px-2 py-1">{activity.date}</td>
          <td className="border px-2 py-1">
            <button
              onClick={() => handleDeleteActivity(activity.id)}
              className="text-red-500"
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
        placeholder="Description"
        value={newActivity.description}
        onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
        className="border rounded px-2 py-1 mb-2 w-full"
      />
      <input
        type="text"
        placeholder="Type"
        value={newActivity.type}
        onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
        className="border rounded px-2 py-1 mb-2 w-full"
      />
      <input
        type="datetime-local"
        name="date"
        value={newActivity.date}
        onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
        className="border rounded px-2 py-1 mb-2 w-full"
      />
      <button onClick={handleAddActivity} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
        Add Activity
      </button>
    </div>
  );
};

export default LeadDetails;
