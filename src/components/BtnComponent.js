import React from 'react';

function BtnComponent({start, stop, reset, disable}) {

    return (
        <div className='btns'>
            <button onClick={stop}>Stop</button>
            <button disabled={disable} onClick={start}>Start</button>
            <button onClick={reset}>Reset</button>
        </div>
  );
}

export default BtnComponent;
