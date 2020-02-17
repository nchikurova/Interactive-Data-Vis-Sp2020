// CONST and GLOBALS

const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7
margin = { top: 20, bottom: 50, left: 60, right: 40 }
radius = 5;

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

d3.json("../data/AirbnbD3.json", d3.autoType).then(raw_data => {
  console.log("raw_data", raw_data)
  state.data = "raw_data";
  init();
});

//INITIALIZING FUNCTION
// this will be run one time when data finishes loading in

function init() {
  // SCALES
  xScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d => d.room_type))
    .range([margin.left, width - margin.right]);

  yScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d => d.borough))
}
