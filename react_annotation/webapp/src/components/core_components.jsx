/*
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React from "react";

function OnboardingComponent({ onSubmit, taskData }) {
  if (!taskData) {
    return <LoadingScreen />;
  }
  return (
    <div>
      <Directions>{taskData.instructions}</Directions>
      <section className="section">
        Example:
        <div className="container">
          <b>Sentence 1:</b>
          <p className="subtitle is-4">
            <span key="0">{taskData.example1}</span>
          </p>
          <b>Sentence 2:</b>
          <p className="subtitle is-4">
            <span key="1">{taskData.example2}</span>
          </p>
          <p className="subtitle is-4">
            <span key="1">{taskData.explanation}</span>
          </p>
          <b>Answer:</b>
          <p className="subtitle is-4">
            <span key="0">{taskData.answer}</span>
          </p>
        </div>
      </section>
      <div className="field is-grouped" style={{ justifyContent: "center" }}>
        <div className="control">
          <button
            className="button is-success"
            onClick={() =>
              window.alert("Please read the instructions carefully.")
            }
          >
            Positive
          </button>
        </div>
        <div className="control">
          <button
            className="button is-danger"
            onClick={() => onSubmit({ success: true })}
          >
            Negative
          </button>
        </div>
        <div className="control">
          <button
            className="button"
            onClick={() =>
              window.alert("Please read the instructions carefully.")
            }
          >
            Neutral
          </button>
        </div>
        <div className="control">
          <button
            className="button is-dark"
            onClick={() =>
              window.alert("Please read the instructions carefully.")
            }
          >
            Dunno
          </button>
        </div>
      </div>
    </div>
  );
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
  let ratings = ["changed", "unchanged", "dunno"];
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
            <b>Word:</b> {item.word}
          </p>
          <p className="is-4">1) {item.text1}</p>
          <p className="is-4">2) {item.text2}</p>
          <div className="buttons">
            {ratings.map((selectedRating, i) => (
              <label key={item.word + i} className="radio">
                <input
                  type="radio"
                  name={`rating_${item.word + i}`}
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
        Please mark if changed or not for the question below.
      </Directions>
      <section className="section">
        <div className="container">
          <b>Word:</b>
          <p className="title is-3">
            <span key="0"> {loaded && taskData[unitTaskCounter]["word"]} </span>
          </p>
          <b>Sentence 1:</b>
          <p className="subtitle is-4">
            <span key="1">
              {" "}
              {loaded && taskData[unitTaskCounter]["text1"]}{" "}
            </span>
          </p>
          <b>Sentence 2:</b>
          <p className="subtitle is-4">
            <span key="2">
              {" "}
              {loaded && taskData[unitTaskCounter]["text2"]}{" "}
            </span>
          </p>
        </div>
        <div className="controlbox">
          <p className="subtitle is-5">
            The usage of '<b>{loaded && taskData[unitTaskCounter]["word"]}</b>'
            in the second sentence is more positive, negative or neutral with
            respect to the first sentence?
          </p>
          <div className="field is-grouped">
            <div className="control">
              <button
                data-cy="positive-button"
                className="button is-success is-large"
                onClick={() => handleSubmit("changed")}
              >
                Changed
              </button>
            </div>
            <div className="control">
              <button
                className="button is-large"
                onClick={() => handleSubmit("unchanged")}
              >
                Unchanged
              </button>
            </div>
            <div className="control">
              <button
                className="button is-large is-dark"
                onClick={() => handleSubmit("dunno")}
              >
                I don't know
              </button>
            </div>
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
