// CONST and GLOBALS

const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 70, left: 70, right: 40 },
  radius = 8;

/** these variables allow us to access anything we manipulate in
* init() but need access to in draw().
* All these variables are empty before we assign something to them.*/
let svg;
let xScale;
let yScale;

// Aplication state
let state = {
  data: [],
  selectedType: "All",
};

// Load data

d3.json("../data/csvjson.json", d3.autoType).then(raw_data => {
  console.log("raw_data", raw_data)
  state.data = raw_data;
  init();
});

//INITIALIZING FUNCTION
// this will be run one time when data finishes loading in

function init() {
  // SCALES
  xScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d => d.number_of_reviews))
    .range([margin.left, width - margin.right]);

  yScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d => d.rating))
    .range([height - margin.bottom, margin.top]);

  // AXES

  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale);

  // UI element set up
  // add dropdown (HTML selection) for interaction
  // HTML select reference https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
  const selectElement = d3.select("#dropdown").on("change", function () {
    console.log("new selected restaurant type is", this.value);
    //'this' === the selectElement
    // this.value holds the dropdown value a user just selected
    state.selectedType = this.value;
    draw(); //re-draw the graph based on this new selection
  })
  // add in dropdown options from the unique values in the data
  selectElement
    .selectAll("option")

    .data(["All", "Italian", "Japanese", "French", "American"]) // unique data values-- (hint: to do this programmatically take a look `Sets`)
    .join("option")
    .attr("value", d => d)
    .text(d => d);

  // d3.select('body')
  //   .append('div')
  //   .attr('id', 'tooltip')
  //   .attr('style', 'position: absolute, opacity: 0.5;')
  //   .attr('position: top: 100%, left:50%');

  // d3.select('svg')
  //   .selectAll('circle')
  //   .join('circle')
  //   .on('mouseover', function () {
  //     d3.select('#tooltip').style('opacity', 1).text(d)
  //   })
  //   .on('mouseout', function () {
  //     d3.select('#tooltip').style('opacity', 0)
  //   })
  // create an svg element in our main `d3-container` element
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)



  // add the xAxis
  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", "50%")
    .attr("dy", "3em")
    .text("Number of Reviews");

  // add the yAxis
  svg
    .append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("y", "50%") //in the middle of line
    .attr("dx", "-3em")
    .attr("writing-mode", "vertical-rl")
    .text("Restaurant Google Rating")

  div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  draw();
  // calls the draw function
}

/**
* DRAW FUNCTION
* we call this everytime there is an update to the data/state
* */
function draw() {
  // filter the data for the selectedParty
  let filteredData = state.data;
  // if there is a selectedType, filter the data before mapping it to our elements
  if (state.selectedType !== "All") {
    filteredData = state.data.filter(d => d.type === state.selectedType);
  }


  const dot = svg
    .selectAll(".dot")

    .data(filteredData, d => d.restaurant) // use `d.name` as the `key` to match between HTML and data elements

    .join(
      enter =>
        // enter selections -- all data elements that don't have a `.dot` element attached to them yet
        enter
          .append("circle")
          .attr("class", "dot") // Note: this is important so we can identify it in future updates
          .attr("stroke", "grey")
          .attr("opacity", 0.8)
          .attr("fill", d => {
            if (d.type === "Japanese") return "red";
            else if (d.type === "Italian") return "coral";
            else if (d.type === "French") return "gold";
            else return "purple";
          })
          .attr("r", radius)
          .attr("cx", d => xScale(d.number_of_reviews))
          .attr("cy", d => margin.bottom + 150)
          .on("mouseover", function (d) {
            div.transition()
              .duration(200)
              .style("opacity", 0.5);
            div.html(d.restaurant)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function (d) {
            div.transition()
              .duration(500)
              .style("opacity", 0);
          })
          // initial value - to be transitioned
          .call(enter =>
            enter
              .transition() // initialize transition
              //.delay(d => 50 * d.rating) // delay on each element
              .duration(1200) // duration 500ms
              .attr("cy", d => yScale(d.rating))
          ),
      update =>
        update.call(update =>
          // update selections -- all data elements that match with a `.dot` element
          update
            .transition()
            .duration(250)
        ),
      exit =>
        exit.call(exit =>
          //     // exit selections -- all the `.dot` element that no longer match to HTML elements
          exit
            .transition()
            .delay(d => 10 * d.rating)
            .duration(500)
            .attr("cy", height)
            .remove()
        )
    );
}

