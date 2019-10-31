import { OpenVidu } from "openvidu-browser"
import React, { useState } from "react"
import "./App.css"
import UserVideoComponent from "./UserVideoComponent"
import getToken from "./getToken"
import useMainVideo from "./useMainVideo"

const App = () => {
  const {
    handleMainVideoStream,
    deleteSubscriber,
    mySessionId,
    setMySessionId,
    myUserName,
    setMyUserName,
    mainStreamManager,
    setMainStreamManager,
    publisher,
    setPublisher,
    subscribers,
    setSubscribers,
    leaveSession,
    session,
    setSession,
    OV,
    setOV
  } = useMainVideo()

  const joinSession = () => {
    let OV = null
    OV = new OpenVidu()
    let session = OV.initSession()

    setSession(session)
    setOV(OV)
  }

  return (
    <div className="container">
      {session === undefined ? (
        <input
          className="btn btn-large btn-primary"
          type="button"
          id="createSession"
          onClick={joinSession}
          value="Create session"
        />
      ) : null}

      {session !== undefined ? (
        <div id="session">
          <div id="session-header">
            <h1 id="session-title">{mySessionId}</h1>
            <input
              className="btn btn-large btn-danger"
              type="button"
              id="buttonLeaveSession"
              onClick={leaveSession}
              value="Leave session"
            />
          </div>

          {mainStreamManager !== undefined ? (
            <div id="main-video" className="col-md-6">
              <UserVideoComponent streamManager={mainStreamManager} />
            </div>
          ) : null}

          <div id="video-container" className="col-md-6">
            {publisher !== undefined ? (
              <div
                className="stream-container col-md-6 col-xs-6"
                onClick={() => handleMainVideoStream(publisher)}
              >
                {console.log("PUBLISHER", publisher)}
                <UserVideoComponent streamManager={publisher} />
              </div>
            ) : (
              <h1>{publisher}</h1>
            )}

            {subscribers.map((sub, i) => (
              <div
                key={i}
                className="stream-container col-md-6 col-xs-6"
                onClick={() => handleMainVideoStream(sub)}
              >
                <UserVideoComponent streamManager={sub} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <h1>{subscribers}</h1>
      )}
    </div>
  )
}

export default App
