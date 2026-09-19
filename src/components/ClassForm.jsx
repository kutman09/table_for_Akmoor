import React, { useState, useEffect } from 'react';
import styles from './ClassForm.module.scss';
import { DAYS, ROOMS } from '../utils/constants';
import { X } from 'lucide-react';
import { generateTimeSlots } from '../utils/time';

import { checkOverlap } from '../utils/time';
import { TRACKS } from '../utils/constants';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { isAfter, startOfDay } from 'date-fns';

const ClassForm = ({ initialData, trackId, classes = [], onSave, onClose, onDelete }) => {
  const [formData, setFormData] = useState({
    day: DAYS[0],
    startTime: '09:00',
    endTime: '10:00',
    topic: '',
    teacher: '',
    location: ROOMS[0],
    link: '',
    ...initialData,
    trackId
  });
  
  const [error, setError] = useState('');
  
  const timeSlots = generateTimeSlots();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.endTime <= formData.startTime) {
      setError('End time must be after start time.');
      return;
    }

    if (formData.courseStartDate && formData.courseEndDate) {
      if (isAfter(startOfDay(new Date(formData.courseStartDate)), startOfDay(new Date(formData.courseEndDate)))) {
        setError('Course end date must be after or on the start date.');
        return;
      }
    }

    if (formData.location !== 'Online') {
      const conflict = classes.find(c => 
        c.id !== formData.id && 
        c.location === formData.location && 
        c.day === formData.day &&
        checkOverlap(formData.startTime, formData.endTime, c.startTime, c.endTime)
      );

      if (conflict) {
        const trackName = TRACKS.find(t => t.id === conflict.trackId)?.label || conflict.trackId;
        let topicName = conflict.topic?.trim() || 'Class';
        if (conflict.trackId === 'individual' && conflict.studentName) {
          topicName = `Student: ${conflict.studentName}`;
        }
        const teacherName = conflict.teacher ? ` with ${conflict.teacher}` : '';
        setError(`Room conflict: ${formData.location} is already booked for ${trackName} (${topicName}${teacherName}) from ${conflict.startTime} to ${conflict.endTime}.`);
        return;
      }
    }

    setError('');
    onSave(formData);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{initialData?.id ? 'Edit Class' : 'Create Class'}</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={20}/></button>
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Day of Week</label>
            <select name="day" value={formData.day} onChange={handleChange} required>
              {DAYS.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Start Time</label>
              <select name="startTime" value={formData.startTime} onChange={handleChange} required>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>End Time</label>
              <select name="endTime" value={formData.endTime} onChange={handleChange} required>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className={styles.field}>
            <label>Topic / Class Name</label>
            <input type="text" name="topic" value={formData.topic} onChange={handleChange} placeholder="e.g. Intro to React" />
          </div>
          
          {trackId === 'individual' && (
            <div className={styles.field}>
              <label>Student Name</label>
              <input type="text" name="studentName" value={formData.studentName || ''} onChange={handleChange} placeholder="e.g. John Doe" />
            </div>
          )}
          
          <div className={styles.field}>
            <label>Teacher *</label>
            <input type="text" name="teacher" value={formData.teacher} onChange={handleChange} required placeholder="Teacher Name" />
          </div>
          
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Course Start Date (optional)</label>
              <DatePicker
                selected={formData.courseStartDate ? new Date(formData.courseStartDate) : null}
                onChange={(date) => setFormData(prev => ({ ...prev, courseStartDate: date ? date.toISOString() : null }))}
                selectsStart
                startDate={formData.courseStartDate ? new Date(formData.courseStartDate) : null}
                endDate={formData.courseEndDate ? new Date(formData.courseEndDate) : null}
                placeholderText="Start Date"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </div>
            <div className={styles.field}>
              <label>Course End Date (optional)</label>
              <DatePicker
                selected={formData.courseEndDate ? new Date(formData.courseEndDate) : null}
                onChange={(date) => setFormData(prev => ({ ...prev, courseEndDate: date ? date.toISOString() : null }))}
                selectsEnd
                startDate={formData.courseStartDate ? new Date(formData.courseStartDate) : null}
                endDate={formData.courseEndDate ? new Date(formData.courseEndDate) : null}
                minDate={formData.courseStartDate ? new Date(formData.courseStartDate) : null}
                placeholderText="End Date"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </div>
          </div>
          
          <div className={styles.field}>
            <label>Location *</label>
            <select name="location" value={formData.location} onChange={handleChange} required>
              {ROOMS.map(room => (
                <option key={room} value={room}>{room}</option>
              ))}
              <option value="Online">Online</option>
            </select>
          </div>
          
          {formData.location === 'Online' && (
            <div className={styles.field}>
              <label>Meeting Link (optional)</label>
              <input type="url" name="link" value={formData.link || ''} onChange={handleChange} placeholder="https://zoom.us/j/..." />
            </div>
          )}
          
          <div className={styles.actions}>
            {initialData?.id && (
              <button type="button" className={styles.deleteBtn} onClick={() => onDelete(initialData.id)}>
                Delete
              </button>
            )}
            <div className={styles.spacer}></div>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.saveBtn}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassForm;
