import React, { useState, useRef, useEffect } from 'react';
import './Hero.css';
import { randomText } from '../Features/getrandomtext'

const codeSnippets = [
    "function add(a, b) { return a + b; }",
    "const square = (x) => x * x;",
    "console.log('Hello, World!');",
    "const array = [1, 2, 3, 4, 5];\nconst sum = array.reduce((acc, curr) => acc + curr, 0);",
];

function getRandomText(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}



function Timer(props) {
    const { time, correctWords, startCounting, activeWord } = props;
    const minutes = time / 60;
    const accuracy = (((correctWords / activeWord) * 100) || 0).toFixed(2);
    const speed = ((correctWords / minutes) || 0).toFixed(2);

    return (
        <div className='speed'>
            <p><b>Time:</b> {time}</p>
            <p><b>Accuracy:</b> {accuracy} %</p>
            <p><b>Speed:</b> {speed} WPM</p>
            <p><b>Accuracy&times;Speed:</b> {((accuracy / 100) * speed).toFixed(2)}</p>
        </div>
    );
}

function Word(props) {
    const { text, active, correct } = props
    if (correct === true) {
        return <span className='correct'>{text} </span>
    }
    if (correct === false) {
        return <span className='incorrect'>{text} </span>
    }
    if (active) {
        return <span className='active'>{text} </span>
    }
    return <span>{text} </span>
}
Word = React.memo(Word)

const Hero = () => {
    const [userInput, setUserInput] = useState('');
    const [showCodeSnippet, setShowCodeSnippet] = useState(false);
    const [cloud, setCloud] = useState(randomText());
    const [activeWord, setActiveWord] = useState(0);
    const [correctWord, setCorrectWord] = useState([]);
    const [startCounting, setStartCounting] = useState(false);
    const [time, setTime] = useState(0);

    const inputRef = useRef(null);


    useEffect(() => {
        inputRef.current.focus();
        handleRandomSnippet();
    }, []);

    useEffect(() => {
        setUserInput('');
        setActiveWord(0);
        setCorrectWord([]);
        setStartCounting(false);
        setTime(0)
    }, [cloud]);
    useEffect(() => {
        async function fetchdata(){

            const response = await fetch("http://127.0.0.1:5000");
            const py = await response.json();
            // console.log(py);
        }
        fetchdata()
    })
    


    useEffect(() => {
        let id;
        if (startCounting) {
            id = setInterval(() => {
                setTime((oldTime) => oldTime + 1);
            }, 1000);
        }
        return () => clearInterval(id);
    }, [startCounting]);



    function processInput(value) {
        if (activeWord === cloud.split(' ').length) {
            return;
        }
        if (!startCounting) {
            setStartCounting(true);
        }
        if (value.endsWith(' ')) {
            if (activeWord === cloud.split(' ').length - 1) {
                if(value.length -1 >= cloud.split(' ')[activeWord].length){

                    // functionfv

                    setStartCounting(false);
                    setUserInput("Completed");
                } 
            } else {
                if(value.length -1 >= cloud.split(' ')[activeWord].length) setUserInput("");
            }
            // console.log(value.length)
            // console.log(cloud.split(' ')[activeWord].length)
            if(value.length-1 >= cloud.split(' ')[activeWord].length){
                setActiveWord((index) => index + 1);
                // console.log(1)
            } 
            setCorrectWord((data) => {
                const word = value.trim();
                const newResult = [...data];
                newResult[activeWord] = word === cloud.split(' ')[activeWord];
                return newResult;
            });
        } else {
            setUserInput(value);
        }
    }

    function handleRandomSnippet() {
        setCloud(randomText());
        setShowCodeSnippet(true);
        inputRef.current.focus()
    }

    function handleShowCode() {
        setCloud(getRandomText(codeSnippets));
        setShowCodeSnippet(true);
        inputRef.current.focus()
    }

    return (
        <>
            <div className='container1'>

                <div className='random-btn'>
                    <button className='random-snippet-btn' onClick={handleRandomSnippet}>
                        Show Text
                    </button>
                    <button className='random-snippet-btn' onClick={handleShowCode}>
                        Show Code
                    </button>
                </div>

                <p className='main'>

                    {showCodeSnippet ? (

                        cloud.split(' ').map((word, index) => (
                            <Word
                                key={index}
                                text={word}
                                active={index === activeWord}
                                correct={correctWord[index]}
                            />
                        ))

                    ) : (
                        cloud.split(' ').map((line, index) => (
                            <span key={index}>{line}</span>
                        ))
                    )}
                </p>

                <div className='inp'>
                    <input
                        ref={inputRef}
                        className='input'
                        type='text'
                        placeholder='start typing'
                        value={userInput}
                        onChange={(e) => {
                            processInput(e.target.value);
                        }}
                    />

                    <Timer
                        time={time}
                        startCounting={startCounting}
                        correctWords={correctWord.filter(Boolean).length}
                        activeWord={activeWord}
                    />
                </div>


            </div>
        </>
    );
};

export default Hero;
