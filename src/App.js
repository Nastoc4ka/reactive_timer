import React, {useEffect, useState} from 'react';
import {fromEvent, interval, Subject} from 'rxjs';
import {buffer, debounceTime, filter, map, scan, startWith, takeUntil,} from 'rxjs/operators';
import './App.css';
import BtnComponent from "./components/BtnComponent";
import TimerComponent from "./components/TimerComponent";

const count$ = (init = 0) => interval(1000)
    .pipe(
        startWith(init),
        scan(time => time + 1000)
    );

const actions$ = new Subject();

const stop$ = actions$.pipe(filter(action => action === 'stop'));
const reset$ = actions$.pipe(filter(action => action === 'reset'));
const doubleClick$ = actions$.pipe(filter(action => action === 'doubleClick'));

const timerReset$ = (init) => count$(init).pipe(takeUntil(reset$));

const timerStop$ = (init) => timerReset$(init).pipe(takeUntil(stop$));

const observable$ = (init) => timerStop$(init).pipe(takeUntil(doubleClick$));

function App() {

    const [time, setTime] = useState(0);
    const [startDisable, setStartDisable] = useState(false);

    const timer = React.useRef(null);

    useEffect(() => {
        const mouse$ = fromEvent(timer.current, 'click');
        const buff$ = mouse$.pipe(
            debounceTime(299),
        );

        mouse$.pipe(
            buffer(buff$),
            map(list => {
                return list.length;
            }),
            filter(x => x === 2),
        ).subscribe(() => {
            setStartDisable(false);
            actions$.next('doubleClick')
        });
    }, []);

    const start = () => {
        setStartDisable(true);
        observable$(time).subscribe(setTime);
    };

    const stop = () => {
        setStartDisable(false);
        actions$.next('stop');
        setTime(0);
    };

    const wait = () => {
        actions$.next('wait');
    };

    const reset = () => {
        setStartDisable(true);
        actions$.next('reset');
        observable$().subscribe(setTime);
    };

    return (
        <div className='container'>
            <div className='timer' ref={timer}>
                <h2>Timer</h2>
                <TimerComponent time={time}/>
                <BtnComponent start={start}
                              disable={startDisable}
                              stop={stop}
                              reset={reset}/>
            </div>
        </div>
    );
}

export default App;
