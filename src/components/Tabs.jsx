import React, { useState } from 'react';
import styles from './Tabs.module.scss';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import TrackForm from './TrackForm';

const Tabs = ({ tracks, activeTrack, setActiveTrack, onUpdateTracks, onDeleteTrack }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState(null);

  const handleAddTrackClick = () => {
    setEditingTrack(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (track, e) => {
    e.stopPropagation();
    setEditingTrack(track);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (track, e) => {
    e.stopPropagation();
    onDeleteTrack(track.id);
  };

  const handleSaveTrack = (trackData) => {
    if (editingTrack) {
      const newTracks = tracks.map(t => t.id === editingTrack.id ? trackData : t);
      onUpdateTracks(newTracks);
    } else {
      const newTracks = [...tracks, trackData];
      onUpdateTracks(newTracks);
      setActiveTrack(trackData.id);
    }
    setIsFormOpen(false);
  };

  return (
    <>
      <div className={styles.tabsContainer}>
        {tracks.map(track => (
          <div
            key={track.id}
            className={`${styles.tab} ${activeTrack === track.id ? styles.active : ''}`}
            onClick={() => setActiveTrack(track.id)}
            style={
              activeTrack === track.id
                ? { borderBottomColor: track.color, color: track.color }
                : {}
            }
          >
            <span className={styles.tabLabel}>{track.label}</span>
            {activeTrack === track.id && (
              <div className={styles.tabActions}>
                <button onClick={(e) => handleEditClick(track, e)} title="Rename subject">
                  <Edit2 size={12} />
                </button>
                <button onClick={(e) => handleDeleteClick(track, e)} title="Delete subject">
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        ))}
        
        <button className={styles.addTabBtn} onClick={handleAddTrackClick} title="Add Subject">
          <Plus size={16} />
          <span>Add Subject</span>
        </button>
      </div>

      {isFormOpen && (
        <TrackForm
          initialData={editingTrack}
          onSave={handleSaveTrack}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </>
  );
};

export default Tabs;
