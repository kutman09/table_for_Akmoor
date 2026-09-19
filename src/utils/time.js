import { START_HOUR, END_HOUR, STEP_MINUTES } from './constants';

export const generateTimeSlots = () => {
  const slots = [];
  for (let h = START_HOUR; h < END_HOUR; h++) {
    for (let m = 0; m < 60; m += STEP_MINUTES) {
      slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }
  return slots;
};

export const checkOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

export const timeToRow = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const totalMinutes = (hours - START_HOUR) * 60 + minutes;
  return Math.floor(totalMinutes / STEP_MINUTES) + 2; // +1 for CSS Grid 1-index, +1 for Header row
};

export const calculateDurationRows = (start, end) => {
  const [h1, m1] = start.split(':').map(Number);
  const [h2, m2] = end.split(':').map(Number);
  const totalMins1 = h1 * 60 + m1;
  const totalMins2 = h2 * 60 + m2;
  return Math.ceil((totalMins2 - totalMins1) / STEP_MINUTES);
};

export const calculateLayout = (classesForDay) => {
  const sorted = [...classesForDay].sort((a, b) => {
    if (a.startTime === b.startTime) {
      return a.endTime > b.endTime ? -1 : 1;
    }
    return a.startTime > b.startTime ? 1 : -1;
  });

  const clusters = [];
  let currentCluster = [];
  let clusterEnd = null;

  for (const cls of sorted) {
    if (currentCluster.length === 0) {
      currentCluster.push(cls);
      clusterEnd = cls.endTime;
    } else {
      if (cls.startTime < clusterEnd) {
        currentCluster.push(cls);
        if (cls.endTime > clusterEnd) clusterEnd = cls.endTime;
      } else {
        clusters.push(currentCluster);
        currentCluster = [cls];
        clusterEnd = cls.endTime;
      }
    }
  }
  if (currentCluster.length > 0) clusters.push(currentCluster);

  const layouts = {};

  for (const cluster of clusters) {
    const columns = [];
    for (const cls of cluster) {
      let placed = false;
      for (let i = 0; i < columns.length; i++) {
        const lastInCol = columns[i][columns[i].length - 1];
        if (cls.startTime >= lastInCol.endTime) {
          columns[i].push(cls);
          cls._colIndex = i;
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push([cls]);
        cls._colIndex = columns.length - 1;
      }
    }
    const totalCols = columns.length;
    for (const cls of cluster) {
      layouts[cls.id] = {
        width: 100 / totalCols,
        left: (100 / totalCols) * cls._colIndex
      };
    }
  }

  return layouts;
};
