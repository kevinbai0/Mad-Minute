import './App.css';
import { useEffect, useState } from 'react';

const operators = ['+', '-', 'x'];

function genInitialQuestions() {
  return [
    ...(new Array(50)).fill(undefined).map(val => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    const operator = Math.floor(Math.random() * 3);

    return {
      num1, 
      num2,
      operator: operators[operator]
    }
  })
  ]
}

const operate = (a, b, op) => {
  if (op === '+') return a + b;
  if (op === '-') return a - b;
  if (op === 'x') return a * b;
}

function App() {
  const [state, setState] = useState(genInitialQuestions());
  const [timeLeft, setTimeleft] = useState(60);

  function handleInput(index) {
    return (e) => {
      const text = e.target.value;
      setState(state.map((val, i) => index === i ? {
        ...val,
        input: text.replace(/[^0-9]/g, '')
      } : val))
    }
  }

  function calculateFinish() {
    const right = [];
    const wrong = [];
    state.forEach((val, i) => {
      const targetResult = operate(val.num1, val.num2, val.operator);
      const givenResult = parseInt(val.input ?? '');
      if (givenResult === targetResult) {
        right.push(i);
      } else {
        wrong.push(i);
      }
    });
    setState(state.map((val, index) => {
      if (right.find(n => n === index)) {
        return {
          ...val,
          correct: true,
        }
      }
      return {
        ...val,
        correct: false
      };
    }))
    alert(`You got ${right.length} right!`);
  }

  useEffect(() => {
    const startDate = new Date().getTime();
    function handleInterval() {
      const currDate = new Date().getTime();
      const diff = currDate - startDate;
      const friendlyTime = Math.ceil(diff / 1000);
      if (friendlyTime !== timeLeft) {
        setTimeleft(60 - friendlyTime);
        if (friendlyTime === 60) {
          clearInterval(interval);
        }
      }
    }
    const interval = setInterval(handleInterval, 20);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      calculateFinish();
    }
  }, [timeLeft])

  return (
    <div className="App" style={{padding: '50px'}}>
      <div style={{fontSize: 24}}>Timer {timeLeft}</div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gridGap: '20px'}}>
        {state.map((val, index) => (
          <div style={{background: val.correct === true ? 'green' : val.correct === false ? 'red' : undefined}}>
            <div style={{'textAlign': 'right', borderBottom: '1px solid black'}}>
              <div>{val.num1}</div>
              <span style={{marginRight: '10px'}}>{val.operator}</span><span>{val.num2}</span>
            </div>
            <input type="text" style={{ width: '100%', border: '1px solid black', textAlign: 'right', fontSize: '16px' }} value={val.input} onChange={handleInput(index)} />
          </div>
        ))}
      </div>
      <button onClick={calculateFinish}>Finish</button>
    </div>
  );
}

export default App;
