import React, { useState } from "react";
import './TodoItem.css';

const TodoItem = ({
  title,
  description,
  isCompleted,
  updateHandler, // Now handles both completion and text updates
  deleteHandler,
  id,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);

  const handleUpdate = () => {
    // Call updateHandler with id, newTitle, newDescription to update text
    updateHandler(id, newTitle, newDescription);
    setEditMode(false); // Exit edit mode after saving
  };

  const handleCheckboxChange = () => {
    // Call updateHandler with only id to toggle isCompleted
    updateHandler(id);
  };

  return (
    <div className="todo">
      <div>
        {editMode ? (
          <>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="edit-input" // Add a class for styling if needed
            />
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="edit-textarea" // Add a class for styling if needed
            />
          </>
        ) : (
          <>
            <h4>{title}</h4>
            <p>{description}</p>
          </>
        )}
      </div>
      <div>
        <input
          onChange={handleCheckboxChange} // Separate handler for checkbox
          type="checkbox"
          checked={isCompleted}
        />
        {editMode ? (
          <button onClick={handleUpdate} className="btn save-btn">
            Save
          </button>
        ) : (
          <button onClick={() => setEditMode(true)} className="btn edit-btn">
            Edit
          </button>
        )}
        <button onClick={() => deleteHandler(id)} className="btn delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;