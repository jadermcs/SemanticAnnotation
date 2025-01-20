/*
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  BaseFrontend,
  OnboardingComponent,
  LoadingScreen,
} from "./components/core_components.jsx";
import { useMephistoTask, ErrorBoundary } from "mephisto-task";

/* ================= Application Components ================= */

function MainApp() {
  const {
    agentId,
    assignmentId,
    blockedReason,
    blockedExplanation,
    isPreview,
    isLoading,
    initialTaskData,
    handleSubmit,
    handleFatalError,
    isOnboarding,
  } = useMephistoTask();
  const [wid, setWid] = useState(null);

  useEffect(() => {
    if (wid) {
      window.location.href = `?worker_id=${wid}&assignment_id=${parseInt(Math.random() * 100)}`;
    }
  }, [wid]);

  if (blockedReason !== null) {
    return (
      <section className="hero is-medium is-danger">
        <div className="hero-body">
          <h2 className="title is-3">{blockedExplanation}</h2>{" "}
        </div>
      </section>
    );
  }
  if (isPreview) {
    return (
      <section>
        <section className="hero is-medium is-link">
          <div className="hero-body container">
            <div className="title is-3">
              This is a study on perception of words with multiple meanings.
            </div>
            <div className="subtitle is-4">
              Inside you'll be asked to classify how the perception of a word
              varies for different sentences.
            </div>
          </div>
        </section>
        <section className="hero is-medium">
          <div className="hero-body container">
            <p className="subtitle is-4">
              Your answers will be completely anonymous. LIST will not collect
              your personal data through this questionnaire and will not be able
              to identify you based on your answers. For more information about
              LIST’s privacy notice please visit our webpage at:{" "}
              <a href="https://www.list.lu/fr/research-participant-privacy-notice/">
                list.lu
              </a>
            </p>
            <div className="field is-grouped">
              <div className="control">
                <button
                  data-cy="okay-button"
                  className="button is-large is-success"
                  onClick={() => {
                    if (!wid) {
                      let generatedWid = document.cookie
                        .split("; ")
                        .find((row) => row.startsWith("worker_id="))
                        ?.split("=")[1];
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
                  I want to participate
                </button>
              </div>
              <div className="control">
                <button
                  data-cy="okay-button"
                  className="button is-large is-danger"
                  onClick={() => window.alert("You can close the tab.")}
                >
                  I don't want to participate
                </button>
              </div>
            </div>
          </div>
        </section>
      </section>
    );
  }
  if (isLoading || !initialTaskData) {
    return <LoadingScreen />;
  }
  if (isOnboarding) {
    return (
      <OnboardingComponent onSubmit={handleSubmit} taskData={initialTaskData} />
    );
  }

  return (
    <div>
      <ErrorBoundary handleError={handleFatalError}>
        <BaseFrontend
          taskData={initialTaskData}
          onSubmit={handleSubmit}
          isOnboarding={isOnboarding}
          onError={handleFatalError}
          blockedReason={blockedReason}
          getWorkerName={getWorkerName}
          assignmentId={assignmentId}
        />
      </ErrorBoundary>
    </div>
  );
}

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<MainApp />);
