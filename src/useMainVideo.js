import { OpenVidu } from "openvidu-browser"
import { useState, useEffect } from "react"
import getToken from "./getToken"

const useMainVIdeo = () => {
  const [mySessionId, setMySessionId] = useState("SessionA")
  const [myUserName, setMyUserName] = useState(
    `Participant ${Math.floor(Math.random() * 100)}`
  )
  const [session, setSession] = useState(undefined)
  const [OV, setOV] = useState(null)
  const [mainStreamManager, setMainStreamManager] = useState(undefined)
  const [publisher, setPublisher] = useState(undefined)
  const [subscribers, setSubscribers] = useState([])

  useEffect(() => {
    window.addEventListener("beforeunload", onbeforeunload)
    callback()

    return () => {
      window.removeEventListener("beforeunload", onbeforeunload)
    }
  }, [session])

  const onbeforeunload = event => {
    leaveSession()
  }

  const handleMainVideoStream = stream => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream)
    }
  }

  const deleteSubscriber = streamManager => {
    let _subscribers = subscribers
    let index = _subscribers.indexOf(streamManager, 0)
    if (index > -1) {
      _subscribers.splice(index, 1)
      setSubscribers(_subscribers)
    }
  }

  const callback = () => {
    let mySession = session

    if (mySession != undefined) {
      console.log("SESSION: ", mySession)

      // --- 3) Specify the actions when events take place in the session ---

      // On every new Stream received...
      mySession.on("streamCreated", event => {
        console.log("WE CANNOT REACH HERE", session)

        // Subscribe to the Stream to receive it. Second parameter is undefined
        // so OpenVidu doesn't create an HTML video by its own
        var subscriber = mySession.subscribe(event.stream, undefined)
        var _subscribers = subscribers
        _subscribers.push(subscriber)

        // Update the state with the new subscribers
        //   this.setState({
        //     subscribers: subscribers
        //   })
        // })

        setSubscribers(_subscribers)

        // On every Stream destroyed...
        mySession.on("streamDestroyed", event => {
          // Remove the stream from 'subscribers' array
          deleteSubscriber(event.stream.streamManager)
        })

        // --- 4) Connect to the session with a valid user token ---

        // 'getToken' method is simulating what your server-side should do.
        // 'token' parameter should be retrieved and returned by your own backend
        getToken(mySessionId).then(token => {
          // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
          // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
          mySession
            .connect(token, { clientData: myUserName })
            .then(() => {
              // --- 5) Get your own camera stream ---

              // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
              // element: we will manage it on our own) and with the desired properties
              let publisher = OV.initPublisher(undefined, {
                audioSource: undefined, // The source of audio. If undefined default microphone
                videoSource: undefined, // The source of video. If undefined default webcam
                publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                publishVideo: true, // Whether you want to start publishing with your video enabled or not
                resolution: "640x480", // The resolution of your video
                frameRate: 30, // The frame rate of your video
                insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
                mirror: false // Whether to mirror your local video or not
              })

              // --- 6) Publish your stream ---

              mySession.publish(publisher)

              // Set the main video in the page to display our webcam and store our Publisher
              //   this.setState({
              //     mainStreamManager: publisher,
              //     publisher: publisher
              //   })
              setMainStreamManager(publisher)
              setPublisher(publisher)
            })
            .catch(error => {
              console.log(
                "There was an error connecting to the session:",
                error.code,
                error.message
              )
            })
        })
      })
    }
  }

  const leaveSession = () => {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    const mySession = session

    if (mySession) {
      mySession.disconnect()
    }

    // Empty all properties...
    setSession(null)

    setSession(undefined)
    setSubscribers([])
    setMySessionId("SessionA")
    setMyUserName(`Participant ${Math.floor(Math.random() * 100)}`)
    setMainStreamManager(undefined)
    setPublisher(undefined)
  }

  return {
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
    OV,
    setOV,
    leaveSession,
    session,
    setSession
  }
}

export default useMainVIdeo
