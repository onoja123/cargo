//import google
import {
  Client,
  DistanceMatrixResponse,
  TravelMode,
  LatLng,
} from "@googlemaps/google-maps-services-js";
//import google for maps api

//create a new client
export const client = new Client({});

// client;
client.placeAutocomplete({
  params: {
    input: "Lagos",
    key: "AIzaSyAAa0KXRWkwFQfLJ6aK8h-z0VLxny0q7Ao",
  },
});

class GoogleMap {
  public searchLocationsByName(name: string): Promise<any> {
    return client.placeAutocomplete({
      params: {
        input: name,
        key: process.env.GOOGLE_MAPS_API_KEY || "",
      },
    });
  }

  // distance and duration
  public getDistanceAndDuration(
    origin: LatLng,
    destination: any
  ): Promise<DistanceMatrixResponse> {
    return client.distancematrix({
      params: {
        origins: [origin],
        destinations: [...destination],
        mode: TravelMode.driving,
        key: process.env.GOOGLE_MAPS_API_KEY || "",
      },
    });
  }

  public getPlaceDetails(placeId: string): Promise<any> {
    return client.reverseGeocode({
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_MAPS_API_KEY || "",
      },
    });
  }
}

export default new GoogleMap();

// app.get("/map-test/:id", (req, res) => {
//   // client
//   //   .distancematrix({
//   //     params: {
//   //       origins: ["Lagos"],
//   //       destinations: [{ lat: 40.6905615, lng: -73.9976592 }],
//   //       key: "AIzaSyAAa0KXRWkwFQfLJ6aK8h-z0VLxny0q7Ao",
//   //     },
//   //     timeout: 1000, // milliseconds
//   //   })
//   client
//     .placeAutocomplete({
//       params: {
//         input: req.params.id,
//         key: "AIzaSyAAa0KXRWkwFQfLJ6aK8h-z0VLxny0q7Ao",
//       },
//     })
//     .then((r) => {
//       // console.log(r, r.data.rows[0].elements[0].distance);
//       res.send(r.data);
//     })
//     .catch((e) => {
//       console.log(e);
//     });
// });
// app.get("/map-distance/:start/:end", (req, res) => {
//   client
//     .distancematrix({
//       params: {
//         // origins: {
//         // },
//         //use place id
//         // origins: [{ place_id: req.params.id || "" }],
//         // origins: [req.params.id || ""],
//         origins: [`place_id:${req.params.start}`],
//         // destinations: [{ lat: 40.6905615, lng: -73.9976592 }],
//         destinations: [`place_id:${req.params.end}`],
//         key: "AIzaSyAAa0KXRWkwFQfLJ6aK8h-z0VLxny0q7Ao",
//       },
//       timeout: 1000, // milliseconds
//     })
//     // client
//     //   .placeAutocomplete({
//     //     params: {
//     //       input: req.params.id,
//     //       key: "AIzaSyAAa0KXRWkwFQfLJ6aK8h-z0VLxny0q7Ao",
//     //     },
//     //   })
//     .then((r) => {
//       console.log(r, r.data.rows[0].elements[0].distance);
//       res.send(r.data);
//     })
//     .catch((e) => {
//       console.log(e);
//     });
// });

//get locations by name
