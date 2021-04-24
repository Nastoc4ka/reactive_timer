import React from 'react';

function TimerComponent({time}) {

    return (
      <h1 className='clock'>{new Date(time).toISOString().slice(11, 19)}</h1>
  );
}

export default TimerComponent;
