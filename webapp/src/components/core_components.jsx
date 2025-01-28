/*
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React from "react";

function OnboardingComponent({ onSubmit, taskData }) {
  const [loaded, setLoaded] = React.useState(false);
  const [unitTaskCounter, setUnitTaskCounter] = React.useState(0);
  const unitTaskPrevCountRef = React.useRef();
  React.useEffect(() => {
    //assign the ref's current value to the count Hook
    unitTaskPrevCountRef.current = unitTaskCounter;
    setLoaded(true);
  }, [unitTaskCounter]); //run this code when the value of count changes
  function handleSubmit(label) {
    setUnitTaskCounter(unitTaskCounter + 1);
  }
  if (!taskData) {
    return <LoadingScreen />;
  }
  return unitTaskCounter < taskData.examples.length ? (
    <div>
      <Directions>{taskData.instructions}</Directions>
      <section className="section">
        Example:
        <div className="container">
          <b>Sentence 1:</b>
          <p className="subtitle is-4">
            <span key="0">{taskData.examples[unitTaskCounter].example1}</span>
          </p>
          <b>Sentence 2:</b>
          <p className="subtitle is-4">
            <span key="1">{taskData.examples[unitTaskCounter].example2}</span>
          </p>
          <b>Task:</b>
          <p className="subtitle is-4">
            <span key="2">{taskData.examples[unitTaskCounter].explanation}</span>
          </p>
          <b>Answer:</b>
          <p className="subtitle is-4">
            <span key="3">{taskData.examples[unitTaskCounter].answer}</span>
          </p>
        </div>
      </section>
      <div className="field is-grouped" style={{ justifyContent: "center" }}>
        {taskData.labels.map((item, index) => (
            <div className="control" key={index}>
              <button
                className={`button is-large ${item === 'dunno' ? 'is-dark' : ''}`}
                onClick={() => 
            taskData.examples[unitTaskCounter].label === item ? handleSubmit() :
                onSubmit({ success: false })}
              >
                {item === 'dunno' ? "I don't know" : item}
              </button>
            </div>
        ))}
      </div>
    </div>
  ) : (<div>{onSubmit({ success: true })}</div>);
}

function LoadingScreen() {
  return <Directions>Loading...</Directions>;
}

function Directions({ children }) {
  return (
    <section className="hero is-light" data-cy="directions-container">
      <div className="hero-body">
        <div className="container">
          <p className="subtitle is-5">{children}</p>
        </div>
      </div>
    </section>
  );
}

function getWid() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("worker_id="))
    ?.split("=")[1];
}

function generate_ratings({ data, answer, setAnswer }) {
  function handleRatingChange(item, index) {
    const newAnswer = [...answer];
    newAnswer[index] = item;
    setAnswer(newAnswer);
  }
  return (
    <div className="container">
      {data.map((item, index) => (
        <div key={index} className="box">
          <p className="is-4">
            <b>Word:</b> {item.LEMMA}
          </p>
          <p className="is-4">1) {item.USAGE_1}</p>
          <p className="is-4">2) {item.USAGE_2}</p>
          <div className="buttons">
            {item.OPTIONS.map((selectedRating, i) => (
              <label key={item.LEMMA + i} className="radio">
                <input
                  type="radio"
                  name={`rating_${item.LEMMA + i}`}
                  checked={selectedRating === answer[index]}
                  onChange={() => handleRatingChange(selectedRating, index)}
                />
                {selectedRating}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SimpleFrontend({
  taskData,
  isOnboarding,
  onSubmit,
  onError,
  blockedReason,
  getWorkerName,
  assignmentId,
}) {
  const [loaded, setLoaded] = React.useState(false);
  const [thanks, setThanks] = React.useState(false);
  const [answer, setAnswer] = React.useState([]);
  const [unitTaskCounter, setUnitTaskCounter] = React.useState(0);
  const unitTaskPrevCountRef = React.useRef();
  const [wid, setWid] = React.useState(null);
  React.useEffect(() => {
    //assign the ref's current value to the count Hook
    unitTaskPrevCountRef.current = unitTaskCounter;
    setLoaded(true);
  }, [unitTaskCounter]); //run this code when the value of count changes

  React.useEffect(() => {
    if (wid) {
      window.location.href = `?worker_id=${wid}&assignment_id=${parseInt(Math.random() * 100)}`;
    }
  }, [wid]);

  function handleSubmit(label) {
    setAnswer([...answer, label]);
    setUnitTaskCounter(unitTaskCounter + 1);
  }
  return unitTaskCounter < taskData.length ? (
    <div>
      <Directions>
        Please select the appropriate option for the question below.
      </Directions>
      <section className="section">
        <div className="container">
          <b>Word:</b>
          <p className="title is-3">
            <span key="0"> {loaded && taskData[unitTaskCounter]["LEMMA"]} </span>
          </p>
          <b>Sentence 1:</b>
          <p className="subtitle is-4">
            <span key="1">
              {" "}
              {loaded && taskData[unitTaskCounter]["USAGE_1"]}{" "}
            </span>
          </p>
          <b>Sentence 2:</b>
          <p className="subtitle is-4">
            <span key="2">
              {" "}
              {loaded && taskData[unitTaskCounter]["USAGE_2"]}{" "}
            </span>
          </p>
        </div>
        <div className="controlbox">
          <p className="subtitle is-5">
            The usage of '<b>{loaded && taskData[unitTaskCounter]["LEMMA"]}</b>'
            in the second sentence is more positive, negative or neutral with
            respect to the first sentence?
          </p>
          <div className="field is-grouped">

        {loaded && taskData[unitTaskCounter].OPTIONS.map((item, index) => (
            <div className="control" key={index}>
              <button className="button is-large" onClick={() => handleSubmit(item)}
              >
                {item}
              </button>
            </div>
        ))}
          </div>
        </div>
      </section>
    </div>
  ) : thanks ? (
    <section>
      <section className="hero is-success" data-cy="directions-container">
        <div className="hero-body">
          <div className="container">
            <p className="title is-1">
              That's all, thanks for your participation!
            </p>
          </div>
        </div>
      </section>
      <div className="hero-body">
        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="okay-button"
              className="button is-large is-success"
              onClick={() => {
                if (!wid) {
                  let generatedWid = getWid();
                  if (!generatedWid) {
                    generatedWid = (Math.random() + 1)
                      .toString(36)
                      .substring(2);
                    document.cookie = `worker_id=${generatedWid};max-age=31536000`;
                  }
                  setWid(generatedWid);
                }
              }}
            >
              I want to answer another round
            </button>
          </div>
        </div>
      </div>
    </section>
  ) : (
    <div>
      <Directions>Please check your answers and submit.</Directions>
      {taskData &&
        taskData.map &&
        generate_ratings({ data: taskData, answer, setAnswer })}
      <div className="control hero">
        <button
          className="button is-large is-info"
          onClick={() => {
            onSubmit({ ratings: answer, data: taskData, wid: getWid() });
            setThanks(true);
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export { LoadingScreen, SimpleFrontend as BaseFrontend, OnboardingComponent };
