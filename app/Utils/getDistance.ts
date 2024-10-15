// import axios from "axios";

// export const fetchDistance = (setDistance: (distance: string) => void) => {
//   const token = process.env.NEXT_PUBLIC_THINGSBOARD_TOKEN;
//   const entityId = process.env.NEXT_PUBLIC_ENTITY_ID;
//   const webSocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

//   if (!token || !entityId || !webSocketUrl) {
//     console.error("WebSocket connection details are missing!");
//     return;
//   }

//   const webSocket = new WebSocket(webSocketUrl);

//   webSocket.onopen = () => {
//     const object = {
//       authCmd: {
//         cmdId: 0,
//         token: token,
//       },
//       cmds: [
//         {
//           entityType: "DEVICE",
//           entityId: entityId,
//           scope: "LATEST_TELEMETRY",
//           cmdId: 10,
//           type: "TIMESERIES",
//         },
//       ],
//     };
//     const data = JSON.stringify(object);
//     webSocket.send(data);
//     console.log("Message sent: " + data);
//   };

//   webSocket.onmessage = async (event) => {
//     const receivedMsg = JSON.parse(event.data);

//     if (receivedMsg.data?.Distance) {
//       const distanceValue = receivedMsg.data.Distance[0][1]; 
//       const formattedDistance = parseFloat(distanceValue).toFixed(2); 
//       setDistance(formattedDistance); 

//       try {
//         await axios.post('https://aquasense-e472a26d7581.herokuapp.com/api/sensors', {
//           distance: formattedDistance,
//         });
//         console.log('Distance data sent to the database');
//       } catch (error) {
//         console.error('Error sending distance data to the database: ', error);
//       }
//     }

//     console.log("Message received: ", receivedMsg);
//   };

//   webSocket.onclose = () => {
//     console.log("Connection closed!");
//   };

//   webSocket.onerror = (error) => {
//     console.error("WebSocket error: ", error);
//   };

//   // Return cleanup function to close WebSocket on component unmount
//   return () => {
//     if (webSocket.readyState === WebSocket.OPEN) {
//       webSocket.close();
//     }
//   };
// };
import axios from "axios";
export const fetchDistance = (setDistance: (distance: string) => void) => {
  const token = process.env.NEXT_PUBLIC_THINGSBOARD_TOKEN;
  const entityId = process.env.NEXT_PUBLIC_ENTITY_ID;
  const webSocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

  if (!token || !entityId || !webSocketUrl) {
    console.error("WebSocket connection details are missing!");
    return;
  }

  const webSocket = new WebSocket(webSocketUrl);

  webSocket.onopen = () => {
    const object = {
      authCmd: {
        cmdId: 0,
        token: token,
      },
      cmds: [
        {
          entityType: "DEVICE",
        entityId: entityId,
          scope: "LATEST_TELEMETRY",
          cmdId: 10,
          type: "TIMESERIES",
        },
      ],
    };
    const data = JSON.stringify(object);
    webSocket.send(data);
    console.log("Message sent: " + data);
  };

  webSocket.onmessage = async (event) => {
    const receivedMsg = JSON.parse(event.data);

    if (receivedMsg.data?.Distance) {
      const distanceValue = receivedMsg.data.Distance[0][1];
      const formattedDistance = parseFloat(distanceValue).toFixed(2);
      setDistance(formattedDistance);

      try {
        await axios.post('https://aquasense-e472a26d7581.herokuapp.com/api/sensors', {
          distance: formattedDistance,
        });
        console.log('Distance data sent to the database');
      } catch (error) {
        console.error('Error sending distance data to the database: ', error);
      }
    }

    console.log("Message received: ", receivedMsg);
  };

  webSocket.onclose = () => {
    console.log("Connection closed!");
  };

  webSocket.onerror = (error) => {
    console.error("WebSocket error: ", error);
  };

  // Return cleanup function to close WebSocket on component unmount
  return () => {
    if (webSocket.readyState === WebSocket.OPEN) {
      webSocket.close();
    }
  };
};