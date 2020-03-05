/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
    height = window.innerHeight * 0.7,
    margin = { top: 20, bottom: 50, left: 60, right: 40 },
    radius = 8;

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;

/**
 * APPLICATION STATE
 * */
let state = {
    geojson: null,
    extremes: null,
    hover: {
        latitude: null,
        longitude: null,
        state: null,
    },
};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
    d3.json("../data/usState.json"),
    d3.csv("../data/usHeatExtremes.csv", d3.autoType),
]).then(([geojson, extremes]) => {
    state.geojson = geojson;
    state.extremes = extremes;
    console.log("state: ", state);
    init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
    // our projection and path are only defined once, and we don't need to access them in the draw function,
    // so they can be locally scoped to init()
    const projection = d3.geoAlbersUsa().fitSize([width, height], state.geojson);
    const path = d3.geoPath().projection(projection);
    //const colorScale = d3.geoAlbersUsa().range(["paleturquoise", "darkblue"]);
    // create an svg element in our main `d3-container` element
    svg = d3
        .select("#d3-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    //.attr("fill", d => colorScale(state.exremes));
    svg
        .selectAll(".state")
        // all of the features of the geojson, meaning all the states as individuals
        .data(state.geojson.features)
        .join("path")
        .attr("d", path)
        .attr("class", "state")
        .attr("fill", "transparent")
        .on("mouseover", d => {
            // when the mouse rolls over this feature, do this
            state.hover["State"] = d.properties.NAME;
            draw(); // re-call the draw function when we set a new hoveredState
        });

    // EXAMPLE 1: going from Lat-Long => x, y
    // for how to position a dot
    //const GradCenterCoord = { latitude: 40.7423, longitude: -73.9833 };
    svg
        .selectAll("circle")
        .data(state.extremes, d => d)
        .join("circle")
        //.attr("r", 4)
        //.attr("fill", "#900C3F")
        .attr("fill", d => {
            if (d["Change in 95 percent Days"] < 0) return "#002db3";
            else if (d["Change in 95 percent Days"] === 0) return "#737373";
            else if (d["Change in 95 percent Days"] > 0) return "darkred";
            else return "brown";
        })
        //.attr("r", d => radius(d["Change in 95 percent Days"]))
        .attr("r", d => {
            if (d["Change in 95 percent Days"] < -18 && d["Change in 95 percent Days"] >= -18) return radius * 2;
            else if (d["Change in 95 percent Days"] > - 18 && d["Change in 95 percent Days"] < -8) return radius;
            else if (d["Change in 95 percent Days"] >= -8 && d["Change in 95 percent Days"] < 0) return radius / 2;
            else if (d["Change in 95 percent Days"] >= 0 && d["Change in 95 percent Days"] < 8) return radius / 2;
            else if (d["Change in 95 percent Days"] >= 8 && d["Change in 95 percent Days"] < 18) return radius;
            else if (d["Change in 95 percent Days"] >= 18 && d["Change in 95 percent Days"] < 40) return radius * 2;
            else if (d["Change in 95 percent Days"] >= 40) return radius * 3;
            else return radius;
        })
        .attr("opacity", 0.5)
        .attr("transform", d => {
            // d.features.map(e => { console.log(e); })
            // console.log(d.features);
            const [x, y] = projection([d.Long, d.Lat]);
            return `translate(${x}, ${y})`;
        })
        ;

    // EXAMPLE 2: going from x, y => lat-long
    // this triggers any movement at all while on the svg
    svg.on("mousemove", () => {
        // we can use d3.mouse() to tell us the exact x and y positions of our cursor
        const [mx, my] = d3.mouse(svg.node());
        // projection can be inverted to return [lat, long] from [x, y] in pixels
        const proj = projection.invert([mx, my]);
        state.hover["Longitude"] = proj[0];
        state.hover["Latitude"] = proj[1];
        draw();
    });

    draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
    // return an array of [key, value] pairs
    hoverData = Object.entries(state.hover);

    d3.select("#hover-content")
        .selectAll("div.row")
        .data(hoverData)
        .join("div")
        .attr("class", "row")
        .html(
            d =>
                // each d is [key, value] pair
                d[1] // check if value exist
                    ? `${d[0]}: ${d[1]}` // if they do, fill them in
                    : null // otherwise, show nothing
        );
}
