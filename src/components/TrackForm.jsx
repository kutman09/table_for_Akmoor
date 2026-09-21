import React, { useState } from 'react';
import styles from './ClassForm.module.scss'; // reuse the modal styling
import { X } from 'lucide-react';

const COLORS = [
  { color: '#3b82f6', bgColor: '#eff6ff' },
  { color: '#eab308', bgColor: '#fefce8' },
  { color: '#06b6d4', bgColor: '#ecfeff' },
  { color: '#ef4444', bgColor: '#fef2f2' },
  { color: '#8b5cf6', bgColor: '#f5f3ff' },
  { color: '#10b981', bgColor: '#ecfdf5' },
  { color: '#f97316', bgColor: '#fff7ed' },
  { color: '#ec4899', bgColor: '#fdf2f8' },
];

const TrackForm = ({ initialData, onSave, onClose }) => {
  const [label, setLabel] = useState(initialData?.label || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = label.trim();
    if (!name) {
      setError('Subject name is required.');
      return;
    }

    if (initialData) {
      onSave({ ...initialData, label: name });
    } else {
      const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
      const colorScheme = COLORS[Math.floor(Math.random() * COLORS.length)];
      onSave({ id, label: name, color: colorScheme.color, bgColor: colorScheme.bgColor });
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} style={{ maxWidth: 400 }}>
        <div className={styles.header}>
          <h2>{initialData ? 'Rename Subject' : 'Add Subject'}</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={20}/></button>
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Subject Name</label>
            <input 
              type="text" 
              value={label} 
              onChange={e => setLabel(e.target.value)} 
              placeholder="e.g. Mathematics" 
              autoFocus
            />
          </div>
          
          <div className={styles.actions}>
            <div className={styles.spacer}></div>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.saveBtn}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrackForm;
