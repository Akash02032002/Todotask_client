// client/pages/Home.jsx

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context, server } from "../main";
import { toast } from "react-hot-toast";
import TodoItem from "../components/TodoItem";
import { Navigate } from "react-router-dom";
import "./Home.css"; // Make sure to import the new Home.css

const Home = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [refresh, setRefresh] = useState(false); // To trigger useEffect on data changes

  const { isAuthenticated } = useContext(Context);

  // This handler is flexible for updating task completion or text (title/description)
  const updateHandler = async (id, newTitle, newDescription) => {
    try {
      let updateData = {};
      if (newTitle !== undefined && newDescription !== undefined) {
        // If both title and description are provided, it's a text update
        updateData = { title: newTitle, description: newDescription };
      } else {
        // Otherwise, it's a toggle of isCompleted.
        // We'll let the backend determine the new isCompleted state for the task.
        updateData = {}; // Sending an empty object means backend will toggle isCompleted
      }

      const { data } = await axios.put(`${server}/task/${id}`, updateData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json", // Important for sending JSON body
        },
      });

      toast.success(data.message);
      setRefresh((prev) => !prev); // Trigger refresh to re-fetch tasks
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const deleteHandler = async (id) => {
    try {
      const { data } = await axios.delete(`${server}/task/${id}`, {
        withCredentials: true,
      });

      toast.success(data.message);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${server}/task/new`,
        {
          title,
          description,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setTitle(""); // Clear title input after successful submission
      setDescription(""); // Clear description input after successful submission
      toast.success(data.message);
      setLoading(false);
      setRefresh((prev) => !prev); // Trigger refresh to re-fetch tasks
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  // Effect to fetch tasks when the component mounts or `refresh` changes
  useEffect(() => {
    // Only attempt to fetch tasks if the user is authenticated
    if (isAuthenticated) {
      axios
        .get(`${server}/task/my`, {
          withCredentials: true,
        })
        .then((res) => {
          setTasks(res.data.tasks);
        })
        .catch((e) => {
          // Display error only if the user is authenticated;
          // otherwise, the Navigate component handles unauthenticated state.
          toast.error(e.response.data.message);
        });
    } else {
      // Clear tasks if not authenticated, to prevent stale data display
      setTasks([]);
    }
  }, [refresh, isAuthenticated]); // Depend on refresh and isAuthenticated

  // Redirect unauthenticated users to the login page
  if (!isAuthenticated) return <Navigate to={"/login"} />;

  return (
    <div className="home-page">
      {" "}
      {/* Main container for the home page */}
      <h1 className="home-heading">Your Todos</h1> {/* Heading for the page */}
      <p className="home-paragraph">Manage your tasks efficiently.</p>{" "}
      {/* Descriptive paragraph */}
      <div className="add-task-section">
        {" "}
        {/* Section for adding new tasks */}
        <section>
          {" "}
          {/* Inner section for form grouping, if desired for styling */}
          <form onSubmit={submitHandler}>
            {/* NEW: Wrap inputs in a div */}
            <div className="input-group">
              <input
                type="text"
                placeholder="Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <button disabled={loading} type="submit">
                Add Task
              </button>
              
            </div>
          </form>
        </section>
      </div>
      <section className="todosContainer">
        {" "}
        {/* Container for displaying tasks */}
        {tasks.length > 0 ? (
          tasks.map((i) => (
            <TodoItem
              title={i.title}
              description={i.description}
              isCompleted={i.isCompleted}
              updateHandler={updateHandler} // Pass the flexible update handler
              deleteHandler={deleteHandler}
              id={i._id}
              key={i._id}
            />
          ))
        ) : (
          <p className="no-tasks-message">No tasks yet! Add one above.</p>
        )}
      </section>
    </div>
  );
};

export default Home;
