import React, { useEffect, createRef } from "react"

const OpenViduVideoComponent = ({ streamManager }) => {
  const videoRef = createRef()

  useEffect(() => {
    if (streamManager && !!videoRef) {
      streamManager.addVideoElement(videoRef.current)
    }
  })

  return <video autoPlay={true} ref={videoRef} />
}

export default OpenViduVideoComponent
