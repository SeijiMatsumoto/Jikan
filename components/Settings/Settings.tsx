import React, { useState, useEffect } from 'react';
import { Offcanvas, OffcanvasHeader, OffcanvasTitle, OffcanvasBody } from 'react-bootstrap';
import { Form, Button } from 'react-bootstrap';
import { BackgroundProvider } from '../BackgroundContext';
import styles from '../../styles/Settings/Settings.module.css';
import Login from './Login';
import Timers from './Timers';
import AlertSound from './AlertSound';
import Brightness from './Brightness';
import AutoStarBreak from './AutoStartBreak';
import Font from './Font';
import ShowSeconds from './ShowSeconds';
import Blur from './Blur';
import TimeFormat from './TimeFormat';
import Search from './Search';

interface Props {
  showSettings: boolean,
  setShowSettings: any
}

const Settings: React.FC<Props> = ({ showSettings, setShowSettings }) => {
  const [isClock, setIsClock] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <>
      <Offcanvas show={showSettings} onHide={() => setShowSettings(false)} placement='end' className={styles.settings}>
        <Offcanvas.Header closeButton className={styles.header}>
          {isClock ? <Offcanvas.Title>Clock Settings</Offcanvas.Title> : <Offcanvas.Title>Pomodoro Settings</Offcanvas.Title>}
        </Offcanvas.Header>
        <Offcanvas.Body className={styles.body}>
          {isClock ?
            // Clock settings
            <div>
              {isLoggedIn ? <div>Profile</div> : <Login />}
              <Brightness />
              <ShowSeconds />
              <Blur />
              <TimeFormat />
              <Font />
              <Search />
            </div> :
            // Pomodoro settings
            <div>
              {isLoggedIn ? <div>Profile</div> : <Login />}
              <Brightness />
              <Form >
                <Timers />
                <AutoStarBreak />
                <Blur />
                <AlertSound />
                <Font />
                <Search />
              </Form>
            </div>}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};


export default Settings;

