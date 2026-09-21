import React, { useState, useEffect } from 'react';
import { getClasses, addClass, updateClass, deleteClass, getTracks, saveTracks, deleteTrackCascade } from './utils/storage';
import Tabs from './components/Tabs';
import ScheduleGrid from './components/ScheduleGrid';
import ClassForm from './components/ClassForm';
import FreeRoomFinder from './components/FreeRoomFinder';
import { Search, Plus } from 'lucide-react';
import './index.scss';

function App() {
  const [tracks, setTracks] = useState([]);
  const [activeTrack, setActiveTrack] = useState('');
  const [classes, setClasses] = useState([]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  
  const [isFinderOpen, setIsFinderOpen] = useState(false);

  useEffect(() => {
    const t = getTracks();
    setTracks(t);
    if (t.length > 0) setActiveTrack(t[0].id);
    setClasses(getClasses());
  }, []);

  const handleUpdateTracks = (newTracks) => {
    setTracks(newTracks);
    saveTracks(newTracks);
  };

  const handleDeleteTrack = (id) => {
    if (confirm('Are you sure you want to delete this subject? All classes in this subject will be lost.')) {
      const { newTracks, newClasses } = deleteTrackCascade(id);
      setTracks(newTracks);
      setClasses(newClasses);
      if (activeTrack === id) {
        setActiveTrack(newTracks.length > 0 ? newTracks[0].id : '');
      }
    }
  };

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
          <h1>ITadis Schedule</h1>
          <div className="header-actions">
            <button className="add-btn" onClick={() => { setFormData(null); setIsFormOpen(true); }}>
              <Plus size={18} />
              <span>Add Class</span>
            </button>
            <button className="finder-btn" onClick={() => setIsFinderOpen(true)}>
              <Search size={18} />
              <span>Find Free Room</span>
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Tabs 
          tracks={tracks}
          activeTrack={activeTrack} 
          setActiveTrack={setActiveTrack} 
          onUpdateTracks={handleUpdateTracks}
          onDeleteTrack={handleDeleteTrack}
        />
        
        {activeTrack && (
          <div className="schedule-wrapper">
            <ScheduleGrid 
              trackId={activeTrack}
              tracks={tracks}
              classes={classes}
              onCellClick={handleCellClick}
              onClassClick={handleClassClick}
            />
          </div>
        )}
      </main>

      {isFormOpen && (
        <ClassForm 
          initialData={formData}
          trackId={activeTrack}
          tracks={tracks}
          classes={classes}
          onSave={handleSaveClass}
          onClose={() => setIsFormOpen(false)}
          onDelete={handleDeleteClass}
        />
      )}

      {isFinderOpen && (
        <FreeRoomFinder 
          classes={classes}
          tracks={tracks}
          onClose={() => setIsFinderOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
