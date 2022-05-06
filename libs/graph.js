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
      name: "Identification",
      group: "2",
      image: "None",
      type: "Theme",
      author: "Victoria Zhu",
      date: "4/19/2022, 7:10:41 PM",
      text: "\"In many ways, when I started watching the show, there were some moments in which…  there were lines… regarding the idea of what a woman is, or what it means to be a woman that I didn't know, or I didn't ever think about… this kind of was one of those moments for me as well. Because, on one hand, like, I'd like to think that I'm not transphobic, and I wouldn't feel threatened by their presence, and that I'm rooting for the better side. But on the other hand, it seems as if the way in which they discussed if femininity is inherent or earned, kind of, it doesn't go against, but it challenges me as someone who is a cisgendered woman… to think about what rights I have to consider myself a woman and what are, you know, potential ways in which I have created barriers for other trans people within the communities that I'm in and also just in general. So I think that in some ways… the clip kind of highlights one of those tense moments and it implored me to think about those things.\" (<a href=\"https://a-collective-gaze.vercel.app/transcript_victoria.html\" target=\"_blank\">transcript</a>)",
      x: 866.6335073491267,
      y: 493.5070244410843,
      index: 0,
      weight: 1,
      px: 866.5195460338036,
      py: 493.50052376786033,
      fixed: false,
    },
    {
      name: "Femininity",
      group: "2",
      image: "None",
      type: "Theme",
      author: "Isabel Ríos",
      date: "4/19/2022, 7:11:17 PM",
      text: '"I think… it sort of expands the ideas of what femininity can be… and rejects certain constraints of what it should be… I think that\'s what I also appreciate about the clip." (<a href="https://a-collective-gaze.vercel.app/transcript_victoria.html" target="_blank">transcript</a>)',
      x: 782.4860403291606,
      y: 566.7491734344914,
      index: 1,
      weight: 1,
      px: 782.4953187772553,
      py: 566.6354045875082,
      fixed: 0,
    },
    {
      name: "Different Perspective Through Social Media",
      group: "2",
      image: "None",
      type: "Theme",
      author: "Isabel Ríos",
      date: "4/19/2022, 7:13:07 PM",
      text: '"I think I relate to… your experience with… analyzing what’s… given as default… to certain women… What comes to my mind is something that I heard in…the podcast Unladylike, a while back… they were talking about… body hair, and how so many women go through, like, ‘Oh, I\'m gonna let my hair from my armpits… grow’... There was the whole trend of… posting it with… colorful tints on social media. But then… [a trans woman] was explaining how… for her, sort of the removal of hair, and like, shaving… meant that she was able to sort of be feminine and different in like… a way that is considered to be feminine… So that was… a point of access to femininity… To me, it was sort of like the shock moment of like, oh, shit… our heads are turned one way… Once I got like a feminist awakening of the first degree, if you will… not really like, deep or anything… I was like, ‘ah, it sucks that like, we have to shave’... whereas… in the case of this person, it was kind of like, ‘Oh, I\'m so happy that I get to shave and sort of showcase my femininity in that way’." (<a href="https://a-collective-gaze.vercel.app/transcript_victoria.html" target="_blank">transcript</a>)',
      x: 573.2988191414875,
      y: 326.4151992444117,
      index: 2,
      weight: 1,
      px: 573.4123696444893,
      py: 326.4212851268486,
      fixed: 0,
    },
    {
      name: "The Viewers’ Influence",
      group: "2",
      image: "https://ak.picdn.net/shutterstock/videos/11487176/thumb/1.jpg",
      type: "Theme",
      author: "Detti Kis",
      date: "4/22/2022, 12:50:58 AM",
      text: "\"So if it happened in real life, and Penny came up to me like, ‘Oh I'm Penny, your friend, I don't want kids’, then suddenly she comes up to me, ",
      x: 657.4462597887446,
      y: 253.1730732038883,
      index: 3,
      weight: 1,
      px: 657.4366271708826,
      py: 253.2863779582889,
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
      x: 719.9696621217686,
      y: 409.9651449893437,
      index: 4,
      weight: 0,
      px: 719.9695434178285,
      py: 409.9650086111186,
    },
  ],
  links: [
    { source: 0, target: 1 },
    { source: 2, target: 3 },
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
