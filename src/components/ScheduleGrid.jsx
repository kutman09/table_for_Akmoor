import React, { useMemo } from 'react';
import styles from './ScheduleGrid.module.scss';
import { DAYS, START_HOUR, END_HOUR, TRACKS } from '../utils/constants';
import { generateTimeSlots, timeToRow, calculateDurationRows, calculateLayout } from '../utils/time';
import { differenceInDays, startOfDay } from 'date-fns';

const ScheduleGrid = ({ trackId, classes, onCellClick, onClassClick }) => {
  const timeSlots = generateTimeSlots();
  
  // Create an array of full hour labels for the y-axis
  const hourLabels = [];
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    hourLabels.push(`${h.toString().padStart(2, '0')}:00`);
  }

  const trackConfig = TRACKS.find(t => t.id === trackId);
  const trackClasses = classes.filter(c => c.trackId === trackId);
  
  // Precompute layout per day
  const classLayouts = useMemo(() => {
    const layouts = {};
    DAYS.forEach(day => {
      const dayClasses = trackClasses.filter(c => c.day === day);
      const dayLayouts = calculateLayout(dayClasses);
      Object.assign(layouts, dayLayouts);
    });
    return layouts;
  }, [trackClasses]);

  const getStatusInfo = (endDateStr) => {
    if (!endDateStr) return null;
    const end = startOfDay(new Date(endDateStr));
    const today = startOfDay(new Date());
    const daysLeft = differenceInDays(end, today);
    if (daysLeft < 0) return { type: 'ended', text: 'Ended' };
    if (daysLeft === 0) return { type: 'warning', text: 'Ends today' };
    if (daysLeft <= 14) return { type: 'warning', text: `Ends in ${daysLeft}d` };
    return null;
  };

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
          const layout = classLayouts[cls.id] || { width: 100, left: 0 };
          const status = getStatusInfo(cls.courseEndDate);
          
          return (
            <div
              key={cls.id}
              className={`${styles.classBlock} ${status ? styles[status.type] : ''}`}
              style={{
                gridRow: `${rowStart} / span ${rowSpan}`,
                gridColumn: dayColumn,
                backgroundColor: trackConfig.bgColor,
                borderLeftColor: trackConfig.color,
                width: `calc(${layout.width}% - 8px)`,
                marginLeft: `calc(${layout.left}% + 4px)`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onClassClick(cls);
              }}
            >
              <div className={styles.classTime}>{cls.startTime} - {cls.endTime}</div>
              <div className={styles.classTopic}>
                {cls.studentName ? `Student: ${cls.studentName}` : (cls.topic?.trim() || trackConfig.label)}
              </div>
              <div className={styles.classMeta}>
                {cls.teacher && <span className={styles.teacher}>{cls.teacher}</span>}
                {cls.location === 'Online' ? (
                  cls.link ? (
                    <a href={cls.link} target="_blank" rel="noreferrer" className={styles.link} onClick={e => e.stopPropagation()}>Online</a>
                  ) : (
                    <span className={styles.location}>Online</span>
                  )
                ) : (
                  <span className={styles.location}>{cls.location}</span>
                )}
              </div>
              {status && (
                <div className={styles.courseStatus}>
                  {status.text}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleGrid;
