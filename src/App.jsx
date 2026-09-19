import React, { useState, useEffect } from 'react';
import { TRACKS } from './utils/constants';
import { getClasses, addClass, updateClass, deleteClass } from './utils/storage';
import Tabs from './components/Tabs';
import ScheduleGrid from './components/ScheduleGrid';
import ClassForm from './components/ClassForm';
import FreeRoomFinder from './components/FreeRoomFinder';
import { Search } from 'lucide-react';
import './index.scss';

function App() {
  const [activeTrack, setActiveTrack] = useState(TRACKS[0].id);
  const [classes, setClasses] = useState([]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  
  const [isFinderOpen, setIsFinderOpen] = useState(false);

  useEffect(() => {
    setClasses(getClasses());
  }, []);

  const handleCellClick = (day, time) => {
    setFormData({ day, startTime: time, endTime: calculateNextSlot(time) });
    setIsFormOpen(true);
  };
  
  const calculateNextSlot = (time) => {
    const [h, m] = time.split(':').map(Number);
    let nextH = h;
    let nextM = m + 60; // default 1 hour class
    if (nextM >= 60) {
      nextH += Math.floor(nextM / 60);
      nextM = nextM % 60;
    }
    return `${nextH.toString().padStart(2, '0')}:${nextM.toString().padStart(2, '0')}`;
  };

  const handleClassClick = (cls) => {
    setFormData(cls);
    setIsFormOpen(true);
  };

  const handleSaveClass = (data) => {
    let newClasses;
    if (data.id) {
      newClasses = updateClass(data.id, data);
    } else {
      newClasses = addClass(data);
    }
    setClasses(newClasses);
    setIsFormOpen(false);
  };

  const handleDeleteClass = (id) => {
    if (confirm('Are you sure you want to delete this class?')) {
      const newClasses = deleteClass(id);
      setClasses(newClasses);
      setIsFormOpen(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>EduCenter Schedule</h1>
          <button className="finder-btn" onClick={() => setIsFinderOpen(true)}>
            <Search size={18} />
            <span>Find Free Room</span>
          </button>
        </div>
      </header>

      <main className="app-main">
        <Tabs activeTrack={activeTrack} setActiveTrack={setActiveTrack} />
        
        <div className="schedule-wrapper">
          <ScheduleGrid 
            trackId={activeTrack} 
            classes={classes}
            onCellClick={handleCellClick}
            onClassClick={handleClassClick}
          />
        </div>
      </main>

      {isFormOpen && (
        <ClassForm 
          initialData={formData}
          trackId={activeTrack}
          classes={classes}
          onSave={handleSaveClass}
          onClose={() => setIsFormOpen(false)}
          onDelete={handleDeleteClass}
        />
      )}

      {isFinderOpen && (
        <FreeRoomFinder 
          classes={classes}
          onClose={() => setIsFinderOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
