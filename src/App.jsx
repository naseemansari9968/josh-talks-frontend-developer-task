import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "low",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (isEditing) {
      handleEditTask(currentTaskId, newTask);
    } else {
      setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
    }
    setNewTask({ title: "", description: "", priority: "low" });
    setIsEditing(false);
    setCurrentTaskId(null);
  };

  const handleEditTask = (id, updatedTask) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
    );
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleCompleted = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startEditing = (task) => {
    setNewTask({ title: task.title, description: task.description, priority: task.priority });
    setIsEditing(true);
    setCurrentTaskId(task.id);
  };

  const filteredTasks = tasks
    .filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  return (
    <div className="app">
      <div className="header">
        <h1>Task Manager</h1>
        <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <hr />
      <div className="task">
        <input type="text" placeholder="Task Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
        <input type="text" placeholder="Task Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />     
        <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })} >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button className="btn" onClick={handleAddTask}>{isEditing ? "Update Task" : "Add Task"}</button>
      </div>

      <h2>Active Tasks</h2>
      <ul>
        {filteredTasks.filter(task => !task.completed).map((task) => (
          <li className="list" key={task.id} style={{color: task.priority === "high" ? "red" : task.priority === "medium" ? "yellow" : "green",}}>
            <h3 className="title">{task.title}{" "}
              <button onClick={() => toggleCompleted(task.id)}>
                {task.completed ? "Undo" : "Complete"}
              </button>
              <button onClick={() => startEditing(task)}>Edit</button>
            </h3>
            <p className="disc">{task.description}</p>
            <p>Priority: {task.priority}</p>
            <button className="btn2" onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>

      
      <h2>Completed Tasks</h2>
      <ul>
        {filteredTasks.filter(task => task.completed).map((task) => (
          <li className="list" key={task.id}>
            <h3 className="title">{task.title}{" "}
              <button onClick={() => toggleCompleted(task.id)}>
                Undo
              </button>
              <button onClick={() => startEditing(task)}>Edit</button>
            </h3>
            <p className="disc">{task.description}</p>
            <p>Priority: {task.priority}</p>
            <button className="btn2" onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
