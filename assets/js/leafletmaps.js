// // This is for final assignment
// // Map 1, pi vs malak
// const map = [L.map("map")];

// map[0].setView([24.5236845, 54.4339713], 17.49);
// var tiles = L.tileLayer(
//   "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
//   {
//     maxZoom: 22,
//     attribution: "",
//     id: "mapbox/dark-v10",
//     tileSize: 512,
//     zoomOffset: -1,
//   }
// ).addTo(map[0]);

// /* global campus, bicycleRental, freeBus, coorsField */
// var bicycleRentalLayer = L.geoJSON([bicycleRental], {
//   style: function (feature) {
//     return feature.properties && feature.properties.style;
//   },
//   onEachFeature: function (feature, layer) {
//     var popupContent =
//       "<p> " + feature.properties.what_word_describe_best_this_so + "</p>";
//     if (feature.properties && feature.properties.popupContent) {
//       popupContent += feature.properties.popupContent;
//     }
//     layer.bindPopup(popupContent);
//   },
//   pointToLayer: function (feature, latlng) {
//     // Pi Data
//     if (feature.properties.Creator == "adsp22_pk2269") {
//       return L.circleMarker(latlng, {
//         radius: 6,
//         fillColor: "#ff7800",
//         color: "#000",
//         weight: 1,
//         opacity: 1,
//         fillOpacity: 0.8,
//       });
//     }
//     // Malak Data
//     if (feature.properties.Creator == "adsp22_mim7995") {
//       return L.circleMarker(latlng, {
//         radius: 6,
//         fillColor: "#ffffff",
//         color: "#000",
//         weight: 1,
//         opacity: 1,
//         fillOpacity: 0.8,
//       });
//     }
//     return false;
//   },
// }).addTo(map[0]);

// // Map 2
// // const map2 = L.map("mapmachinehuman").setView([24.5236845, 54.4339713], 17.49);
