import React, { useState } from 'react';
import styles from './FreeRoomFinder.module.scss';
import { DAYS, ROOMS } from '../utils/constants';
import { generateTimeSlots, checkOverlap } from '../utils/time';
import { X, Search } from 'lucide-react';

const FreeRoomFinder = ({ classes, tracks, onClose }) => {
  const [day, setDay] = useState(DAYS[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [results, setResults] = useState(null);
  
  const timeSlots = generateTimeSlots();

  const handleSearch = () => {
    if (endTime <= startTime) {
      alert('End time must be after start time.');
      return;
    }

    const dayClasses = classes.filter(c => c.day === day && c.location !== 'Online');
    
    const roomStatus = ROOMS.map(room => {
      // Find any class in this room that overlaps with the selected time
      const overlappingClasses = dayClasses.filter(c => 
        c.location === room && 
        checkOverlap(startTime, endTime, c.startTime, c.endTime)
      );

      return {
        room,
        isFree: overlappingClasses.length === 0,
        conflicts: overlappingClasses
      };
    });

    setResults(roomStatus);
  };

  const getTrackName = (id) => tracks.find(t => t.id === id)?.label || id;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Find Free Room</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={20}/></button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.filters}>
            <div className={styles.field}>
              <label>Day</label>
              <select value={day} onChange={e => setDay(e.target.value)}>
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label>Start</label>
              <select value={startTime} onChange={e => setStartTime(e.target.value)}>
                {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label>End</label>
              <select value={endTime} onChange={e => setEndTime(e.target.value)}>
                {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <button className={styles.searchBtn} onClick={handleSearch}>
              <Search size={16} /> Check
            </button>
          </div>

          {results && (
            <div className={styles.results}>
              <h3>Results for {day}, {startTime} - {endTime}</h3>
              <div className={styles.roomList}>
                {results.map(({ room, isFree, conflicts }) => (
                  <div key={room} className={`${styles.roomCard} ${isFree ? styles.free : styles.occupied}`}>
                    <div className={styles.roomName}>{room}</div>
                    <div className={styles.roomStatus}>
                      {isFree ? '✅ Available' : '❌ Occupied'}
                    </div>
                    {!isFree && (
                      <div className={styles.conflicts}>
                        {conflicts.map(c => (
                          <div key={c.id} className={styles.conflictItem}>
                            <strong>{getTrackName(c.trackId)}</strong>: {c.studentName ? `Student: ${c.studentName}` : (c.topic?.trim() || 'Class')} ({c.startTime} - {c.endTime})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreeRoomFinder;
