import React from 'react';
import styles from './ScheduleGrid.module.scss';
import { DAYS, START_HOUR, END_HOUR, TRACKS } from '../utils/constants';
import { generateTimeSlots, timeToRow, calculateDurationRows } from '../utils/time';

const ScheduleGrid = ({ trackId, classes, onCellClick, onClassClick }) => {
  const timeSlots = generateTimeSlots();
  
  // Create an array of full hour labels for the y-axis
  const hourLabels = [];
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    hourLabels.push(`${h.toString().padStart(2, '0')}:00`);
  }

  const trackConfig = TRACKS.find(t => t.id === trackId);
  const trackClasses = classes.filter(c => c.trackId === trackId);

  return (
    <div className={styles.gridContainer}>
      <div className={styles.grid}>
        {/* Header row */}
        <div className={styles.timeHeader} style={{ gridRow: 1, gridColumn: 1 }}>Time</div>
        {DAYS.map((day, index) => (
          <div key={day} className={styles.dayHeader} style={{ gridRow: 1, gridColumn: index + 2 }}>
            {day}
          </div>
        ))}
        
        {/* Y-axis Time Labels */}
        {hourLabels.map((hour, index) => (
          <div 
            key={hour} 
            className={styles.timeLabel} 
            style={{ 
              gridRow: (index * 2) + 2, 
              gridColumn: 1,
              gridRowEnd: `span 2` 
            }}
          >
            <span>{hour}</span>
          </div>
        ))}

        {/* Empty cells for background & click handling */}
        {DAYS.map((day, dayIndex) => (
          timeSlots.map((time, timeIndex) => (
            <div 
              key={`${day}-${time}`} 
              className={styles.gridCell}
              style={{
                gridRow: timeIndex + 2,
                gridColumn: dayIndex + 2
              }}
              onClick={() => onCellClick(day, time)}
            />
          ))
        ))}
        
        {/* Render class blocks */}
        {trackClasses.map(cls => {
          const rowStart = timeToRow(cls.startTime);
          const rowSpan = calculateDurationRows(cls.startTime, cls.endTime);
          const dayColumn = DAYS.indexOf(cls.day) + 2;
          
          return (
            <div
              key={cls.id}
              className={styles.classBlock}
              style={{
                gridRow: `${rowStart} / span ${rowSpan}`,
                gridColumn: dayColumn,
                backgroundColor: trackConfig.bgColor,
                borderLeftColor: trackConfig.color,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onClassClick(cls);
              }}
            >
              <div className={styles.classTime}>{cls.startTime} - {cls.endTime}</div>
              <div className={styles.classTopic}>{cls.topic?.trim() || trackConfig.label}</div>
              <div className={styles.classMeta}>
                {cls.teacher && <span className={styles.teacher}>{cls.teacher}</span>}
                {cls.location === 'Online' ? (
                  <a href={cls.link} target="_blank" rel="noreferrer" className={styles.link} onClick={e => e.stopPropagation()}>Online</a>
                ) : (
                  <span className={styles.location}>{cls.location}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleGrid;
