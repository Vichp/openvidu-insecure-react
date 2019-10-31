import React from "react"
import OpenViduVideoComponent from "./OvVideo"
import "./UserVideo.css"

const UserVideoComponent = ({ streamManager }) => {
  const getNicknameTag = () => {
    // Gets the nickName of the user
    return JSON.parse(streamManager.stream.connection.data).clientData
  }

  return (
    <div>
      {streamManager !== undefined ? (
        <div className="streamcomponent">
          <OpenViduVideoComponent streamManager={streamManager} />
          <div>
            <h4>{getNicknameTag()}</h4>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default UserVideoComponent
