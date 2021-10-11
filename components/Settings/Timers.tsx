import React, { useState, useEffect, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import styles from "../../styles/Settings/Settings.module.css";
import {
  minutesAndSecondsToMillis,
  millisToMinutesAndSeconds,
} from "../../helper/convertTime";

interface Props {
  pomodoroTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  setPomodoroTime: Function;
  setShortBreakTime: Function;
  setLongBreakTime: Function;
  setShowSettings: Function;
}

const Timers: React.FC<Props> = ({
  pomodoroTime,
  shortBreakTime,
  longBreakTime,
  setPomodoroTime,
  setShortBreakTime,
  setLongBreakTime,
  setShowSettings,
}) => {
  const [pomStr, setPomStr] = useState<string>(
    millisToMinutesAndSeconds(pomodoroTime)
  );
  const [shortStr, setShortStr] = useState<string>(
    millisToMinutesAndSeconds(shortBreakTime)
  );
  const [longStr, setLongStr] = useState<string>(
    millisToMinutesAndSeconds(longBreakTime)
  );
  const [minutes, setMinutes] = useState<string[]>([]);
  const [shortMinutes, setShortMinutes] = useState<string[]>([]);
  const [longMinutes, setLongMinutes] = useState<string[]>([]);

  useEffect(() => {
    for (let i = 1; i <= 90; i++) {
      setMinutes((prev) => [...prev, i.toString()]);
      if (i <= 15) {
        setShortMinutes((prev) => [...prev, i.toString()]);
      }
      if (i <= 30) {
        setLongMinutes((prev) => [...prev, i.toString()]);
      }
    }
  }, []);

  useEffect(() => {
    if (minutes.length > 0) {
      console.log(minutes);
    }
  }, [minutes]);

  useEffect(() => {
    if (pomStr === "0") {
      pomChange("1");
    }
    if (shortStr === "0") {
      setShortStr("1");
    }
    if (longStr === "0") {
      setLongStr("1");
    }
  }, [pomStr, shortStr, longStr]);

  const pomChange = (e: any): void => {
    if (parseInt(e.target.value) > 0) {
      e.preventDefault();
      let toMs = minutesAndSecondsToMillis(e.target.value);
      setPomodoroTime(toMs);
    }
  };

  const shortChange = (e: any): void => {
    if (parseInt(e.target.value) > 0) {
      e.preventDefault();
      let toMs = minutesAndSecondsToMillis(e.target.value);
      setShortBreakTime(toMs);
    }
  };

  const longChange = (e: any): void => {
    if (parseInt(e.target.value) > 0) {
      e.preventDefault();
      let toMs = minutesAndSecondsToMillis(e.target.value);
      setLongBreakTime(toMs);
    }
  };

  const resetTimer = (e: any) => {
    setPomodoroTime(1500000);
    setPomStr("25");
    setShortBreakTime(300000);
    setShortStr("5");
    setLongBreakTime(900000);
    setLongStr("15");
    setShowSettings(false);
  };

  return (
    <div className={styles.timers}>
      <Form.Group controlId="formBasicEmail" className={styles.pomodoro}>
        <Form.Label className={styles.timerLabel}>Pomodoro</Form.Label>
        <Form.Select value={parseInt(pomStr)} onChange={(e) => pomChange(e)}>
          {minutes.map((minute) => (
            <option key={minute + "pom"} value={minute}>
              {minute}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="formBasicPassword" className={styles.shortbreak}>
        <Form.Label className={styles.timerLabel}>Short Break</Form.Label>
        <Form.Select value={parseInt(shortStr)} onChange={(e) => pomChange(e)}>
          {shortMinutes.map((minute) => (
            <option key={minute + "short"} value={minute}>
              {minute}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="formBasicPassword" className={styles.longbreak}>
        <Form.Label className={styles.timerLabel}>Long Break</Form.Label>
        <Form.Select value={parseInt(longStr)} onChange={(e) => pomChange(e)}>
          {longMinutes.map((minute) => (
            <option key={minute + "long"} value={minute}>
              {minute}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <button onClick={resetTimer} className={styles.resetBtn}>
        Reset
      </button>
    </div>
  );
};

export default Timers;
