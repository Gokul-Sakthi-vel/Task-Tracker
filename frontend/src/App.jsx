import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import TaskDetailPanel from './components/TaskDetailPanel';
import TaskFormModal from './components/TaskFormModal';

import Dashboard from './pages/Dashboard';
import MyTasks from './pages/MyTasks';
import NotificationsPage from './pages/NotificationsPage';

import API, { getAllTasks, getTaskById, updateTask, deleteTask } from './api/taskApi';

// On app load, check localStorage for existing userId
let userId = localStorage.getItem('userId');
if (!userId) {
  userId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'user_' + Math.random().toString(36).substring(2, 15);
  localStorage.setItem('userId', userId);
}
API.defaults.headers.common['x-user-id'] = userId;

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Responsive sidebar open state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const recordNotification = (taskTitle, action) => {
    const newNotif = {
      id: Date.now() + Math.random().toString(36).substr(2, 5),
      taskTitle,
      action,
      time: new Date()
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await getAllTasks();
      setTasks(res.data.data);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleComplete = async (id, nextStatus) => {
    const taskObj = tasks.find(t => t._id === id);
    const title = taskObj ? taskObj.title : 'Task';

    try {
      await updateTask(id, { status: nextStatus });
      recordNotification(title, nextStatus === 'completed' ? 'completed' : 'updated');
      toast.success(nextStatus === 'completed' ? 'Task completed!' : 'Task reopened.');
      await fetchTasks();

      if (activeTask && activeTask._id === id) {
        const response = await getTaskById(id);
        setActiveTask(response.data.data);
      }
    } catch (err) {
      toast.error('Failed to toggle completion status.');
    }
  };

  const handleTaskClick = (task) => {
    setActiveTask(task);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  const handleDeleteTask = async (id) => {
    const taskObj = tasks.find(t => t._id === id);
    const title = taskObj ? taskObj.title : 'Task';

    try {
      await deleteTask(id);
      recordNotification(title, 'deleted');
      toast.success('Task deleted');
      setIsDetailOpen(false);
      fetchTasks();
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleArchiveTask = async (id) => {
    const taskObj = tasks.find(t => t._id === id);
    const title = taskObj ? taskObj.title : 'Task';

    try {
      await updateTask(id, { status: 'completed' });
      recordNotification(title, 'completed');
      toast.success('Task completed');
      setIsDetailOpen(false);
      fetchTasks();
    } catch (err) {
      toast.error('Failed to archive task');
    }
  };

  const handleNewTaskClick = () => {
    setTaskToEdit(null);
    setIsFormOpen(true);
  };

  const handleTaskUpdate = async () => {
    await fetchTasks();
    if (activeTask) {
      try {
        const response = await getTaskById(activeTask._id);
        setActiveTask(response.data.data);
      } catch (e) {
        console.error('Failed to refresh task details:', e);
      }
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchTasks();
  };

  const getFilteredTasks = () => {
    if (!searchQuery.trim()) return tasks;
    return tasks.filter(t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="app-container">
      {/* Mobile Dark Overlay Background */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Fixed Left Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Pane */}
      <main className="main-content">
        {/* Top Navbar */}
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNewTaskClick={handleNewTaskClick}
          onHamburgerClick={() => setIsSidebarOpen(true)}
        />

        {/* Dynamic page wrapper */}
        <div className="page-body">
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard 
                  tasks={filteredTasks}
                  fetchTasks={fetchTasks}
                  loading={loading}
                  onTaskClick={handleTaskClick} 
                  onToggleComplete={handleToggleComplete}
                />
              } 
            />
            <Route 
              path="/tasks" 
              element={
                <MyTasks
                  tasks={filteredTasks}
                  fetchTasks={fetchTasks}
                  loading={loading}
                  onTaskClick={handleTaskClick}
                  onToggleComplete={handleToggleComplete}
                  onTaskModified={handleTaskUpdate}
                  searchQuery={searchQuery}
                />
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <NotificationsPage 
                  notifications={notifications}
                  onTaskClick={handleTaskClick} 
                />
              } 
            />
          </Routes>
        </div>
      </main>

      {/* Slide-in Right Task Detail Panel */}
      <TaskDetailPanel
        task={activeTask}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onDelete={handleDeleteTask}
        onArchive={handleArchiveTask}
        onEditClick={(taskToEditObj) => {
          setTaskToEdit(taskToEditObj);
          setIsFormOpen(true);
        }}
      />

      {/* Task Creation Form Modal */}
      {isFormOpen && (
        <TaskFormModal
          taskToEdit={taskToEdit}
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleFormSuccess}
          fetchTasks={fetchTasks}
          recordNotification={recordNotification}
        />
      )}

      {/* Toast popup manager */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
