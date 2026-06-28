import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllTasks, deleteTask } from '../api/taskApi';
import FilterBar from '../components/FilterBar';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { FiList, FiClock, FiActivity, FiCheckCircle } from 'react-icons/fi';

const Home = ({ isFormOpen, setIsFormOpen, taskToEdit, setTaskToEdit }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [statsTasks, setStatsTasks] = useState([]); // Master list for counts
  const [loading, setLoading] = useState(true);

  // Sync URL search params
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const priority = searchParams.get('priority') || '';
  const sortBy = searchParams.get('sortBy') || 'newest';

  // State setters that update URL search params
  const setSearch = (val) => updateParam('search', val);
  const setStatus = (val) => updateParam('status', val);
  const setPriority = (val) => updateParam('priority', val);
  const setSortBy = (val) => updateParam('sortBy', val);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  // Fetch tasks with filters + unfiltered stats
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch filtered tasks from backend (status & priority filtering)
      const filteredResult = await getAllTasks({ status, priority });
      setTasks(filteredResult.data || []);

      // Fetch all tasks for static stats calculation
      const statsResult = await getAllTasks({});
      setStatsTasks(statsResult.data || []);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Error fetching tasks';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }, [status, priority]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handle task deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        toast.success('Task deleted successfully!');
        fetchTasks();
      } catch (err) {
        const errMsg = err.response?.data?.message || err.message || 'Error deleting task';
        toast.error(errMsg);
      }
    }
  };

  // Open edit modal
  const handleEditClick = (task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  // Close modal form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setTaskToEdit(null);
  };

  // Form submission success callback
  const handleFormSuccess = () => {
    handleCloseForm();
    fetchTasks();
  };

  // Calculate counts based on statsTasks
  const totalCount = statsTasks.length;
  const pendingCount = statsTasks.filter((t) => t.status === 'pending').length;
  const progressCount = statsTasks.filter((t) => t.status === 'in-progress').length;
  const completedCount = statsTasks.filter((t) => t.status === 'completed').length;

  // Search and sort application
  const getProcessedTasks = () => {
    let result = [...tasks];

    // Client-side text filter
    if (search.trim()) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Client-side sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === 'due-soon') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'due-late') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(b.dueDate) - new Date(a.dueDate);
      }
      return 0;
    });

    return result;
  };

  const processedTasks = getProcessedTasks();

  return (
    <main className="container" style={{ paddingBottom: '40px' }}>
      {/* Stats Summary Panel */}
      <section className="stats-container">
        <div className="stat-card">
          <div className="stat-icon total">
            <FiList />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-value">{totalCount}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <FiClock />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{pendingCount}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon in-progress">
            <FiActivity />
          </div>
          <div className="stat-info">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{progressCount}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">
            <FiCheckCircle />
          </div>
          <div className="stat-info">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{completedCount}</span>
          </div>
        </div>
      </section>

      {/* Filter and sorting actions */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        priority={priority}
        setPriority={setPriority}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onClear={handleClearFilters}
      />

      {/* Tasks listing grid */}
      <TaskList
        tasks={processedTasks}
        loading={loading}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        onClearFilters={handleClearFilters}
      />

      {/* Modal TaskForm */}
      {isFormOpen && (
        <TaskForm
          taskToEdit={taskToEdit}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </main>
  );
};

export default Home;
