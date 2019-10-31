/**
 * --------------------------
 * SERVER-SIDE RESPONSIBILITY
 * --------------------------
 * These methods retrieve the mandatory user token from OpenVidu Server.
 * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
 * the API REST, openvidu-java-client or openvidu-node-client):
 *   1) Initialize a session in OpenVidu Server	(POST /api/sessions)
 *   2) Generate a token in OpenVidu Server		(POST /api/tokens)
 *   3) The token must be consumed in Session.connect() method
 */

import axios from "axios"

const OPENVIDU_SERVER_URL = "https://" + window.location.hostname + ":4443"
const OPENVIDU_SERVER_SECRET = "MY_SECRET"

function getToken(mySessionId) {
  if (mySessionId != undefined) {
    console.log('YYYY', mySessionId)
    return createSession(mySessionId).then(sessionId =>
      createToken(sessionId)
    )
  }
}

function createSession(sessionId) {
  return new Promise((resolve, reject) => {
    var data = JSON.stringify({ customSessionId: sessionId })
    axios
      .post(OPENVIDU_SERVER_URL + "/api/sessions", data, {
        headers: {
          Authorization:
            "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        console.log("CREATE SESION", response)
        resolve(response.data.id)
      })
      .catch(response => {
        var error = Object.assign({}, response)
        if (error.response.status === 409) {
          resolve(sessionId)
        } 
       else {
          console.log(error)
          console.warn(
            "No connection to OpenVidu Server. This may be a certificate error at " +
              OPENVIDU_SERVER_URL
          )
          if (
            window.confirm(
              'No connection to OpenVidu Server. This may be a certificate error at "' +
                OPENVIDU_SERVER_URL +
                '"\n\nClick OK to navigate and accept it. ' +
                'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                OPENVIDU_SERVER_URL +
                '"'
            )
          ) {
            window.location.assign(OPENVIDU_SERVER_URL + "/accept-certificate")
          }
        }
      })
  })
}

function createToken(sessionId) {
  return new Promise((resolve, reject) => {
    var data = JSON.stringify({ session: sessionId })
    axios
      .post(OPENVIDU_SERVER_URL + "/api/tokens", data, {
        headers: {
          Authorization:
            "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        console.log("TOKEN", response)
        resolve(response.data.token)
      })
      .catch(error => reject(error))
  })
}

export default getToken
