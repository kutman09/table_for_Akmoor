import { DEFAULT_TRACKS } from './constants';

const STORAGE_KEY = 'edu_center_schedules';
const TRACKS_KEY = 'itadis_tracks';

export const getTracks = () => {
  try {
    const data = localStorage.getItem(TRACKS_KEY);
    return data ? JSON.parse(data) : DEFAULT_TRACKS;
  } catch (e) {
    console.error('Failed to parse tracks', e);
    return DEFAULT_TRACKS;
  }
};

export const saveTracks = (tracks) => {
  localStorage.setItem(TRACKS_KEY, JSON.stringify(tracks));
};

export const deleteTrackCascade = (trackId) => {
  const tracks = getTracks();
  const newTracks = tracks.filter(t => t.id !== trackId);
  saveTracks(newTracks);
  
  const classes = getClasses();
  const newClasses = classes.filter(c => c.trackId !== trackId);
  saveClasses(newClasses);
  
  return { newTracks, newClasses };
};

export const getClasses = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
    
    // Fallback mock data for alignment testing
    const today = new Date();
    const in5Days = new Date();
    in5Days.setDate(today.getDate() + 5);
    
    return [
      { id: '1', trackId: 'python', day: 'Monday', startTime: '08:00', endTime: '08:30', topic: '30 Min Class', teacher: 'Alice', location: 'Room 1', link: '' },
      { id: '2', trackId: 'python', day: 'Tuesday', startTime: '09:00', endTime: '10:00', topic: '1 Hour Class', teacher: 'Bob', location: 'Room 2', link: '' },
      { id: '3', trackId: 'python', day: 'Wednesday', startTime: '10:30', endTime: '12:00', topic: '1.5 Hour Class', teacher: 'Charlie', location: 'Room 3', link: '' },
      { id: '4', trackId: 'python', day: 'Thursday', startTime: '13:00', endTime: '15:00', topic: '2 Hour Class', teacher: 'Dave', location: 'Online', link: 'https://zoom.us', courseEndDate: in5Days.toISOString() },
      { id: '5', trackId: 'python', day: 'Friday', startTime: '10:00', endTime: '11:00', topic: 'Overlap 1', teacher: 'Eve', location: 'Room 1', link: '' },
      { id: '6', trackId: 'python', day: 'Friday', startTime: '10:30', endTime: '11:30', topic: 'Overlap 2', teacher: 'Frank', location: 'Room 2', link: '' },
      { id: '7', trackId: 'python', day: 'Friday', startTime: '09:30', endTime: '10:45', topic: 'Overlap 3', teacher: 'Grace', location: 'Room 3', link: '' },
    ];
  } catch (e) {
    console.error('Failed to parse schedules from localStorage', e);
    return [];
  }
};

export const saveClasses = (classes) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
};

export const addClass = (classData) => {
  const classes = getClasses();
  const newClass = { ...classData, id: Date.now().toString() };
  classes.push(newClass);
  saveClasses(classes);
  return classes;
};

export const updateClass = (id, updatedData) => {
  const classes = getClasses();
  const index = classes.findIndex(c => c.id === id);
  if (index !== -1) {
    classes[index] = { ...classes[index], ...updatedData };
    saveClasses(classes);
  }
  return classes;
};

export const deleteClass = (id) => {
  const classes = getClasses();
  const newClasses = classes.filter(c => c.id !== id);
  saveClasses(newClasses);
  return newClasses;
};

const PERIODS_KEY = 'edu_center_periods';

export const getCoursePeriods = () => {
  try {
    const data = localStorage.getItem(PERIODS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('Failed to parse periods', e);
    return {};
  }
};

export const saveCoursePeriod = (trackId, period) => {
  const periods = getCoursePeriods();
  periods[trackId] = period;
  localStorage.setItem(PERIODS_KEY, JSON.stringify(periods));
  return periods;
};
