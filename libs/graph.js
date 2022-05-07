//AJAX Request
var request;
var editModeOn = false;
var width = window.innerWidth,
  height = window.innerHeight,
  // var width = 960,
  //   height = 500,
  selected_node,
  selected_target_node,
  selected_link,
  new_line,
  circlesg,
  linesg,
  should_drag = false,
  drawing_line = false,
  nodes = [],
  links = [],
  link_distance = 90;

var zoomEnabled;
var allNodes;
var allLinks;
var showText = true;
var currentNodeText;
//Color Coding
function color(n) {
  var color_list = ["#ffffff", "#ffffff", "#00A86B", "#ad0303", "#0077b6"];
  return color_list[n % color_list.length];
}

var default_name = "Node";

var force = d3.layout
  .force()
  .charge(-1500)
  .linkDistance(link_distance)
  .size([width, height]);

// var zoom = d3.behavior.zoom().on("zoom", function () {
//   svg.attr(
//     "transform",
//     "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")"
//   );
// });

var zoom = d3.behavior.zoom().on("zoom", function () {
  svg.attr(
    "transform",
    "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")"
  );
});

var svgRaw = d3
  .select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);
//Activate the zoom
svgRaw.call(zoom);

var svg = svgRaw.append("g");

d3.select(window)
  .on("mousemove", mousemove)
  .on("mouseup", mouseup)
  .on("keydown", keydown)
  .on("keyup", keyup);

svg
  .append("rect")
  .attr("width", width)
  .attr("height", height)
  .on("mousedown", mousedown);

// Arrow marker
svg
  .append("svg:defs")
  .selectAll("marker")
  .data(["child"])
  .enter()
  .append("svg:marker")
  .attr("id", String)
  .attr("markerUnits", "userSpaceOnUse")
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", link_distance / 2)
  .attr("markerWidth", 10)
  .attr("markerHeight", 10)
  .attr("orient", "auto")
  .append("svg:path")
  .attr("d", "M0,-5L10,0L0,5");

linesg = svg.append("g");
circlesg = svg.append("g");

// Raw Data here
const raw_data = {
  nodes: [
    {
      name: "A",
      group: "2",
      image: "None",
      type: "Theme",
      author: "Author",
      date: "4/19/2022, 7:10:41 PM",
      text: "Description",
      x: 710.0899026359871,
      y: 628.1673668622396,
      index: 0,
      weight: 1,
      px: 710.0431887431804,
      py: 628.0620773211292,
      fixed: 0,
    },
    {
      name: "B",
      group: "2",
      image: "None",
      type: "Theme",
      author: "Author",
      date: "4/19/2022, 7:10:41 PM",
      text: "Description",
      x: 609.4516628191413,
      y: 664.6319279219567,
      index: 1,
      weight: 1,
      px: 609.5380550370112,
      py: 664.4870878420762,
      fixed: 0,
    },
    {
      name: "C",
      group: "2",
      image: "None",
      type: "Theme",
      author: "Author",
      date: "4/19/2022, 7:10:41 PM",
      text: "Description",
      x: 449.5238644105501,
      y: 382.5823635817363,
      index: 2,
      weight: 1,
      px: 449.70881195297346,
      py: 382.5916289111276,
      fixed: 0,
    },
    {
      name: "D",
      group: "2",
      image: "https://ak.picdn.net/shutterstock/videos/11487176/thumb/1.jpg",
      type: "Theme",
      author: "Author",
      date: "4/19/2022, 7:10:41 PM",
      text: "Description",
      x: 546.3684843569915,
      y: 422.91485218374356,
      index: 3,
      weight: 3,
      px: 546.4486837923641,
      py: 422.8822034082581,
      fixed: 0,
    },
    {
      name: "INSTRUCTIONS [CLICK ME]",
      group: "4",
      image: "None",
      type: "Comment/Opinion",
      author: "None",
      date: "5/6/2022, 4:06:16 PM",
      text: "<ul><li>-Click on each circles to read more.</li><li>-Scroll Mouse to Zoom.</li><li>-Drag around with mouse to explore. </li><li>-Click Back to top on the bottom-left to go back to the Response 4 essay.</li><li>-<b><u>Click on black area</u></b> to de-select.</li><ul>",
      x: 796.6554501667379,
      y: 163.87839283759013,
      index: 4,
      weight: 0,
      px: 796.6372938740916,
      py: 164.01380089118922,
      fixed: 0,
    },
    {
      name: "E",
      group: "3",
      image: "None",
      type: "Media",
      author: "None",
      date: "5/7/2022, 10:20:43 AM",
      text: "Description of Point E",
      x: 900.7006996725963,
      y: 610.4468264584303,
      index: 5,
      weight: 0,
      px: 900.6008328904372,
      py: 610.3604582484178,
      fixed: false,
    },
    {
      name: "F",
      group: "3",
      image: "None",
      type: "Media",
      author: "None",
      date: "5/7/2022, 10:20:54 AM",
      text: "Description of F",
      x: 951.7901246855657,
      y: 266.08871695618774,
      index: 6,
      weight: 0,
      px: 951.6887730920305,
      py: 266.1756334971868,
      fixed: 0,
    },
    {
      name: "G",
      group: "3",
      image: "None",
      type: "Media",
      author: "None",
      date: "5/7/2022, 10:21:06 AM",
      text: "Description of G",
      x: 593.4056569506785,
      y: 158.07503118884935,
      index: 7,
      weight: 0,
      px: 593.4941864508659,
      py: 158.18707402684117,
      fixed: false,
    },
    {
      name: "H",
      group: "3",
      image: "None",
      type: "Media",
      author: "None",
      date: "5/7/2022, 10:21:13 AM",
      text: "Description of H",
      x: 648.7478595612869,
      y: 388.4583949532088,
      index: 8,
      weight: 1,
      px: 648.7067890963697,
      py: 388.48660437511313,
      fixed: 0,
    },
    {
      name: "I",
      group: "3",
      image: "None",
      type: "Media",
      author: "None",
      date: "5/7/2022, 10:21:26 AM",
      text: "Description of I",
      x: 972.7194439378724,
      y: 445.95156927234495,
      index: 9,
      weight: 0,
      px: 972.5852481697989,
      py: 445.94994113983364,
      fixed: 0,
    },
  ],
  links: [
    { source: 0, target: 1 },
    { source: 2, target: 3 },
    { source: 3, target: 8 },
    { source: 7, target: 3 },
    { source: 3, target: 9 },
    { source: 6, target: 3 },
    { source: 5, target: 9 },
  ],
};
//Dynamic file loading
if (localStorage.getItem("lastSavedData") === null) {
  nodes = raw_data.nodes;
  links = raw_data.links;
  update();
  force = force.nodes(nodes).links(links);
  force.start();
} else {
  const json = raw_data;
  // decorate a node with a count of its children
  nodes = json.nodes;
  links = json.links;
  update();
  force = force.nodes(nodes).links(links);
  force.start();
}

function update() {
  var link = linesg
    .selectAll("line.link")
    .data(links)
    .attr("x1", function (d) {
      return d.source.x;
    })
    .attr("y1", function (d) {
      return d.source.y;
    })
    .attr("x2", function (d) {
      return d.target.x;
    })
    .attr("y2", function (d) {
      return d.target.y;
    })
    .classed("selected", function (d) {
      return d === selected_link;
    });
  link
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("marker-end", "url(#child)")
    .on("mousedown", line_mousedown);
  link.exit().remove();

  allLinks = link;

  var node = circlesg
    .selectAll(".node")
    .data(nodes, function (d) {
      return d.name;
    })
    .classed("selected", function (d) {
      return d === selected_node;
    })
    .classed("selected_target", function (d) {
      return d === selected_target_node;
    });
  var nodeg = node
    .enter()
    .append("g") //Only show the text after over
    .on("mouseover", appendText)
    .on("mouseout", function () {
      // Remove the info text on mouse out.
      d3.select(this).select("text.info").remove();
    })
    .attr("class", "node")
    .call(force.drag)
    .attr("transform", function (d) {
      if (d.x == undefined) {
        d.x = 0;
      }
      if (d.y == undefined) {
        d.y = 0;
      }
      return "translate(" + d.x + "," + d.y + ")";
    });
  nodeg
    .append("circle")
    .attr("r", 10)
    .on("mousedown", node_mousedown)
    .on("mouseover", node_mouseover)
    .on("mouseout", node_mouseout)
    .style("fill", function (d) {
      return color(d.group); //Color the nodes differently according to category
    })
    .style("opacity", 0.8);

  allNodes = nodeg;
  //Append or not append text, we can choose
  nodeg
    .append("text")
    .classed("nodeText", true)
    .attr("x", 20)
    .attr("y", 10)
    .text(function (d) {
      return d.name;
    });

  node.exit().remove();

  force.on("tick", function (e) {
    link
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });
    node.attr("transform", function (d) {
      if (d.x == undefined) {
        d.x = 0;
      }
      if (d.y == undefined) {
        d.y = 0;
      }
      return "translate(" + d.x + "," + d.y + ")";
    });
  });
}

function appendText(d) {
  var g = d3.select(this); // The node
  // The class is used to remove the additional text later
  // This highlights the text
  var info = g
    .append("text")
    .classed("info", true)
    .attr("x", 20)
    .attr("y", 10)
    .text(function (d) {
      return d.name;
    });
}

// select target node for new node connection
function node_mouseover(d) {
  if (drawing_line && d !== selected_node) {
    // highlight and select target node
    selected_target_node = d;
  }
}

function node_mouseout(d) {
  if (drawing_line) {
    selected_target_node = null;
  }
}

function zoomToNode(d) {
  if (should_drag == false) {
    var translate = [
      width / 2 - zoom.scale() * d.x,
      height / 2 - zoom.scale() * d.y,
    ];
    svg
      .transition()
      .duration(750)
      .call(zoom.translate(translate).scale(zoom.scale()).event);
  }
}

// select node / start drag
function node_mousedown(d) {
  showText = !showText;
  //Clear other texts and append
  var g = d3.select(this); // The node
  // The class is used to remove the additional text later
  var info = g
    .append("text")
    .classed("info", true)
    .attr("x", 20)
    .attr("y", 10)
    .text(d.name);

  //Zoom to that node, when clicked
  zoomToNode(d);
  if (!drawing_line) {
    selected_node = d;
    showInfo(d);
    selected_link = null;
  }
  if (!should_drag) {
    d3.event.stopPropagation();
    drawing_line = true;
  }
  //Pinning the node. Change to true if you want to pin.
  d.fixed = false;
  force.stop();
  //Process the highlight
  //Reduce the opacity of all but the neighbouring nodes
  d = d3.select(this).node().__data__;
  currentNodeText = d;
  allNodes.style("opacity", function (o) {
    return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
  });

  allLinks.style("opacity", function (o) {
    return (d.index == o.source.index) | (d.index == o.target.index) ? 1 : 0.1;
  });
  update();
}

// select line
function line_mousedown(d) {
  selected_link = d;
  selected_node = null;
  update();
}

// draw yellow "new connector" line
function mousemove() {
  if (drawing_line && !should_drag) {
    var m = d3.mouse(svg.node());
    var x = Math.max(0, Math.min(width, m[0]));
    var y = Math.max(0, Math.min(height, m[1]));
    // debounce - only start drawing line if it gets a bit big
    var dx = selected_node.x - x;
    var dy = selected_node.y - y;
    if (Math.sqrt(dx * dx + dy * dy) > 10) {
      // draw a line
      if (!new_line) {
        new_line = linesg.append("line").attr("class", "new_line");
      }
      new_line
        .attr("x1", function (d) {
          return selected_node.x;
        })
        .attr("y1", function (d) {
          return selected_node.y;
        })
        .attr("x2", function (d) {
          return x;
        })
        .attr("y2", function (d) {
          return y;
        });
    }
  }
  update();
}

// add a new disconnected node, upon button click
var addNode = function (Title, fileName, Name, Type, TypeName, Content) {
  var date = new Date();
  var currentNode = {
    name: Title,
    group: Type,
    image: fileName,
    type: TypeName,
    author: Name,
    date: date.toLocaleString(),
    text: Content,
    x: width / 2,
    y: height / 2,
  };
  nodes.push(currentNode);
  selected_node = currentNode;
  selected_link = null;
  force.stop();
  update();
  force.start();
  saveJSON();
  showToast("Saved", 2);
};

// switch between drag mode and add mode
function mousedown() {
  if (selected_node != null) {
    //Reset the line display
    allNodes.style("opacity", 1);
    allLinks.style("opacity", 0.9);
    toggle = 0;
  }
  //Also clear all the texts
  d3.selectAll("text.info").remove();
  //Reset the nodes
  selected_node = null;
  selected_link = null;
  if (selected_node == null) {
    $("#imageCard").fadeOut();
  }
  update();
  force.start();
}

// end node select / add new connected node
function mouseup() {
  drawing_line = false;
  if (new_line) {
    if (selected_target_node) {
      selected_target_node.fixed = false;
      var new_node = selected_target_node;
    } else {
      var m = d3.mouse(svg.node());
      var new_node = {
        x: m[0],
        y: m[1],
        name: default_name + " " + nodes.length,
        group: 1,
      };
      nodes.push(new_node);
    }
    selected_node.fixed = false;
    links.push({ source: selected_node, target: new_node });
    //Update the links
    saveJSON();
    selected_node = selected_target_node = null;
    update();
    setTimeout(function () {
      new_line.remove();
      new_line = null;
      force.start();
    }, 300);
  }
}

function keyup() {
  switch (d3.event.keyCode) {
    case 16: {
      // shift
      should_drag = false;
      svgRaw.call(zoom);
      update();
      force.start();
    }
  }
}

// select for dragging node with shift; delete node with backspace
function keydown() {
  switch (d3.event.keyCode) {
    case 8: // backspace
    case 46: {
      //Delete only when not editing
      if (editModeOn == false) {
        if (selected_node) {
          // deal with nodes
          var i = nodes.indexOf(selected_node);
          nodes.splice(i, 1);
          // find links to/from this node, and delete them too
          var new_links = [];
          links.forEach(function (l) {
            if (l.source !== selected_node && l.target !== selected_node) {
              new_links.push(l);
            }
          });
          links = new_links;
          selected_node = nodes.length ? nodes[i > 0 ? i - 1 : 0] : null;
        } else if (selected_link) {
          // deal with links
          var i = links.indexOf(selected_link);
          links.splice(i, 1);
          selected_link = links.length ? links[i > 0 ? i - 1 : 0] : null;
        }
        //Save JSON after deletion
        saveJSON();
        $("#imageCard").fadeOut();
        update();
      }
      break;
    }
    case 16: {
      // shift
      should_drag = true;
      svgRaw.on(".zoom", null);
      break;
    }
  }
}

function get_file_name() {
  //Construct Filename
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var m = new Date();
  var dateString =
    m.getUTCFullYear() +
    "_" +
    month[m.getUTCMonth()] +
    "_" +
    ("0" + m.getUTCDate()).slice(-2) +
    "_" +
    ("0" + m.getUTCHours()).slice(-2) +
    "_" +
    ("0" + m.getUTCMinutes()).slice(-2) +
    "_" +
    ("0" + m.getUTCSeconds()).slice(-2);
  console.log(dateString);
  return dateString;
}

//GUI
//Show Information
function showInfo(d) {
  $("#titleText").html(d.name);
  $("#contentText").html(d.text);
  $("#contentAuthor").html(d.author);
  //$("#contentDate").html(d.date);
  //If there is no author, don't show the author info
  if (d.author == "None") {
    $("#authorInfo").hide();
  } else {
    $("#authorInfo").show();
  }
  //If there is no image, don't show
  if (d.image == "None" || d.image == undefined) {
    $("#cardImageContainer").hide();
    $("#cardImageSource").attr("src", "./img/white_image.png");
  } else {
    $("#cardImageSource").attr("src", d.image);
    $("#cardImageContainer").fadeIn();
  }
  $("#imageCard").fadeIn();
}

$(document).ready(function () {
  $("#imageCard").hide();
  //Disable Links
  if (allLinks != undefined) {
    allLinks.style("opacity", 0.9);
  }
});

$(document).on("click", "a", function () {
  var href = $(this).attr("href");
  if (href == "#closeForm") {
    $("#contentForm").fadeOut();
    editModeOn = false;
    clearText();
  } else if (href == "#openText") {
    //For Text
    $("#imgPreview").hide();
    $("#imageUploadForm").hide();
    localStorage.setItem("fileName", "None");
    $("#contentForm").fadeIn();
    $("#first_name").focus();
    editModeOn = true;
  } else if (href == "#openImage") {
    //For Image
    $("#imgPreview").hide();
    $("#imageURL").val("");
    $("#imageUploadForm").show();
    $("#contentForm").fadeIn();
    $("#first_name").focus();
    editModeOn = true;
  } else if (href == "#Submit") {
    Submit();
  } else if (href == "#OpenDialogue") {
  } else if (href == "#SaveFile") {
    downloadData();
  }
});

//Graph Traversal
//Toggle stores whether the highlighting is on
var toggle = 0;
//Create an array logging what is connected to what
var linkedByIndex = {};
for (i = 0; i < nodes.length; i++) {
  linkedByIndex[i + "," + i] = 1;
}
links.forEach(function (d) {
  linkedByIndex[d.source.index + "," + d.target.index] = 1;
});
//This function looks up whether a pair are neighbours
function neighboring(a, b) {
  return linkedByIndex[a.index + "," + b.index];
}

//Saving Functions
function saveJSON() {
  //console.log(nodes);
  //Node Parser
  var sourceid, targetid;
  var parsedlink = [];
  for (var j = 0; j < links.length; j++) {
    //console.log(links[j].source.name);
    for (var i = 0; i < nodes.length; i++) {
      //console.log(nodes[i].name);
      if (nodes[i].name == links[j].source.name) {
        sourceid = i;
      }
    }
    for (var i = 0; i < nodes.length; i++) {
      //console.log(nodes[i].name);
      if (nodes[i].name == links[j].target.name) {
        targetid = i;
      }
    }
    parsedlink.push({ source: sourceid, target: targetid });
  }
  //console.log(links);
  //console.log(parsedlink);
  var file_contents = JSON.stringify({
    nodes: nodes,
    links: parsedlink,
  });
  var currentTime = new Date().toLocaleString();
  //Very Important, save in chrome cache
  localStorage.setItem("lastSavedTime", currentTime);
  localStorage.setItem("lastSavedData", file_contents);
  console.log("File successfully saved locally at " + currentTime + ".");
}

function downloadData() {
  var sourceid, targetid;
  var parsedlink = [];
  for (var j = 0; j < links.length; j++) {
    //console.log(links[j].source.name);
    for (var i = 0; i < nodes.length; i++) {
      //console.log(nodes[i].name);
      if (nodes[i].name == links[j].source.name) {
        sourceid = i;
      }
    }
    for (var i = 0; i < nodes.length; i++) {
      //console.log(nodes[i].name);
      if (nodes[i].name == links[j].target.name) {
        targetid = i;
      }
    }
    parsedlink.push({ source: sourceid, target: targetid });
  }
  var blob = new Blob(
    [window.JSON.stringify({ nodes: nodes, links: parsedlink })],
    { type: "text/plain;charset=utf-8" }
  );
  saveAs(blob, get_file_name() + ".json");
}

function clearText() {
  $("#title").val("");
  $("#textarea1").val("");
  $("#first_name").val("");
}

function Submit() {
  var fileName = localStorage.getItem("fileName");
  if (fileName == null) {
    localStorage.setItem("fileName", "None");
  }
  var Name = $("#first_name").val();
  var Content = $("#textarea1").val();
  var Title = $("#title").val();
  if (Name == "") {
    Name = "None";
  }
  var Type = localStorage.getItem("type");
  var TypeName = localStorage.getItem("typeName");
  console.log("New Node Information - ");
  console.log("Image URL:" + fileName);
  console.log("Node Name:" + Name);
  console.log("Node Type:" + Type);
  console.log("Type Name:" + TypeName);
  //Add Node Finally
  if (Title == "") {
    showToast("No Title Given. Please put a title.", 4);
    $("#title").focus();
  } else {
    addNode(Title, fileName, Name, Type, TypeName, Content);
    //Hide content form
    $("#contentForm").fadeOut();
    editModeOn = false;
    clearText();
    //Clear Previous values
  }
}

/*Toast Function */
function showToast(message, seconds) {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");
  document.getElementById("snackbar").innerHTML = message;

  // Add the "show" class to DIV
  x.className = "show";
  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, seconds * 1000);
}
