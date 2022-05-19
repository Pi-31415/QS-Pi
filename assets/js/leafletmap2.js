const mapInfo = [
  {
    // Aldea Beach House
    id: "map_1",
    coords: [24.5236845, 54.4339713],
    zoom: 17.49,
  },
  // Princess Kristina
  {
    id: "map_2",
    coords: [24.5236845, 54.4339713],
    zoom: 17.49,
  },
  // Duquesa Marina Apartment
  {
    id: "map_3",
    coords: [24.5236845, 54.4339713],
    zoom: 17.49,
  },
  // Duquesa Golf
  {
    id: "map_4",
    coords: [24.5236845, 54.4339713],
    zoom: 17.49,
  },
  // Footer Map
  {
    id: "map_5",
    coords: [24.5236845, 54.4339713],
    zoom: 17.49,
  },
];
const maps = {};
mapInfo.forEach(({ id, coords, zoom }) => {
  maps[id] = L.map(id, {
    scrollWheelZoom: false,
  }).setView(coords, zoom);

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
    {
      maxZoom: 22,
      attribution: "",
      id: "mapbox/dark-v10",
      tileSize: 512,
      zoomOffset: -1,
    }
  ).addTo(maps[id]);

  L.geoJSON([bicycleRental], {
    style: function (feature) {
      return feature.properties && feature.properties.style;
    },
    onEachFeature: function (feature, layer) {
      var Radius = 0;
      if (parseInt(feature.properties.what_level_are_you_on_0_ground_)) {
        Radius =
          0 + parseInt(feature.properties.what_level_are_you_on_0_ground_);
      }
      if (Radius == 0) {
        Radius = "ground";
      }
      var popupContent =
        "<p> " +
        feature.properties.what_word_describe_best_this_so +
        " (" +
        feature.properties.what_kind_of_sound_is_this_ +
        ") " +
        " on " +
        Radius +
        " floor.";
      ("</p>");
      if (feature.properties && feature.properties.popupContent) {
        popupContent += feature.properties.popupContent;
      }
      layer.bindPopup(popupContent);
    },
    pointToLayer: function (feature, latlng) {
      if (id == "map_1") {
        // console.log("");
        // document.getElementById("asdf").innerHTML +=
        //   feature.properties.what_kind_of_sound_is_this_ + " ";
        // Display all sounds
        return L.circleMarker(latlng, {
          radius: 6,
          fillColor: "#ffffff",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        });
        return false;
      } else if (id == "map_2") {
        var Radius = 5;
        if (parseInt(feature.properties.what_level_are_you_on_0_ground_)) {
          Radius =
            5 + parseInt(feature.properties.what_level_are_you_on_0_ground_);
        }
        // Pi Data
        if (feature.properties.Creator == "adsp22_pk2269") {
          return L.circleMarker(latlng, {
            radius: Radius,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          });
        }
        // Malak Data
        if (feature.properties.Creator == "adsp22_mim7995") {
          return L.circleMarker(latlng, {
            radius: Radius,
            fillColor: "#ffffff",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          });
        }
        return false;
      } // Map 2 Begins'
      else if (id == "map_3") {
        const categories = ["Human", "Machine", "Natural", "other"];
        const colors = ["#ec526c", "#55a1e5", "#67ce71", "#ffffff"];

        for (let i = 0; i < categories.length; i++) {
          if (feature.properties.what_kind_of_sound_is_this_ == categories[i]) {
            //   Use floor as bubbles
            var Radius = 2;
            if (parseInt(feature.properties.what_level_are_you_on_0_ground_)) {
              Radius =
                2 +
                parseInt(feature.properties.what_level_are_you_on_0_ground_);
            }
            return L.circleMarker(latlng, {
              radius: Radius + 1,
              fillColor: colors[i],
              color: "#000",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8,
            });
          }
        }
        // Malak Data
        return false;
      }
      //   Map 4
      else if (id == "map_4") {
        if (
          String(feature.properties.what_word_describe_best_this_so)
            .toLowerCase()
            .includes("bird")
        ) {
          var Radius = 5;
          if (parseInt(feature.properties.what_level_are_you_on_0_ground_)) {
            Radius =
              5 + parseInt(feature.properties.what_level_are_you_on_0_ground_);
          }
          return L.circleMarker(latlng, {
            radius: Radius,
            fillColor: "#00ff00",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          });
        }
        return false;
      }

      //   Map 5
      else if (id == "map_5") {
        if (
          String(feature.properties.what_word_describe_best_this_so)
            .toLowerCase()
            .includes("music")
        ) {
          var Radius = 5;
          if (parseInt(feature.properties.what_level_are_you_on_0_ground_)) {
            Radius =
              5 + parseInt(feature.properties.what_level_are_you_on_0_ground_);
          }
          return L.circleMarker(latlng, {
            radius: Radius,
            fillColor: "#ffffff",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          });
        }
        return false;
      } else {
        return false;
      }
    },
  }).addTo(maps[id]);
});
