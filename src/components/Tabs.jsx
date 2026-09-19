import React from 'react';
import styles from './Tabs.module.scss';
import { TRACKS } from '../utils/constants';

const Tabs = ({ activeTrack, setActiveTrack }) => {
  return (
    <div className={styles.tabsContainer}>
      {TRACKS.map(track => (
        <button
          key={track.id}
          className={`${styles.tab} ${activeTrack === track.id ? styles.active : ''}`}
          onClick={() => setActiveTrack(track.id)}
          style={
            activeTrack === track.id
              ? { borderBottomColor: track.color, color: track.color }
              : {}
          }
        >
          {track.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
