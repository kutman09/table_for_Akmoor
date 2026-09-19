const STORAGE_KEY = 'edu_center_schedules';

export const getClasses = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
    
    // Fallback mock data for alignment testing
    return [
      { id: '1', trackId: 'python', day: 'Monday', startTime: '08:00', endTime: '08:30', topic: '30 Min Class', teacher: 'Alice', location: 'Room 1', link: '' },
      { id: '2', trackId: 'python', day: 'Tuesday', startTime: '09:00', endTime: '10:00', topic: '1 Hour Class', teacher: 'Bob', location: 'Room 2', link: '' },
      { id: '3', trackId: 'python', day: 'Wednesday', startTime: '10:30', endTime: '12:00', topic: '1.5 Hour Class', teacher: 'Charlie', location: 'Room 3', link: '' },
      { id: '4', trackId: 'python', day: 'Thursday', startTime: '13:00', endTime: '15:00', topic: '2 Hour Class', teacher: 'Dave', location: 'Online', link: 'https://zoom.us' },
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
