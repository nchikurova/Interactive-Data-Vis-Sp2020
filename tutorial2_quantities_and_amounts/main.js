// data load
// reference for d3.autotype: https://github.com/d3/d3-dsv#autoType
d3.csv("../data/squirrelActivities.csv", d3.autoType).then(data => {
    console.log(data);

    // data.sort((first, second) => first.count - second.count)
    data.sort((first, second) => d3.descending(first.count, second.count))

    /** CONSTANTS */
    // constants help us reference the same values throughout our code
    const width = window.innerWidth * 0.9,
        height = window.innerHeight / 2,
        paddingInner = 0.2,
        paddingOuter = 0.2,
        margin = { top: 10, bottom: 10, left: 100, right: 40 };

    /** SCALES */
    // reference for d3.scales: https://github.com/d3/d3-scale
    const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .range([margin.left, width - margin.right])

    console.log(xScale)

    const yScale = d3
        .scaleBand()
        .domain(data.map(d => d.activity))
        .range([margin.top, height - margin.bottom]) // range!!!! might be changed
        .paddingInner(paddingInner)
        .paddingOuter(paddingOuter);


    // reference for d3.axis: https://github.com/d3/d3-axis
    const yAxis = d3
        .axisLeft(yScale)
        .ticks(data.length)
        ;

    const xAxis = d3
        .axisBottom(xScale)
    //.ticks(data.length);

    /** MAIN CODE */
    const svg = d3

        .select("#d3-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // .attr("color", color = ['#0000b4', 'black', '#0094ff', '#0d4bcf', '#0066AE']);
    const colorScale = d3.scaleLinear().domain([0, d3.max(data, d => d.count) + 30]).range(["paleturquoise", "darkblue"])

    // append rects
    const rect = svg
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("y", function (d) {
            return yScale(d.activity);
        })
        .attr("x", margin.left)
        .attr("width", d => xScale(d.count))
        .attr("height", yScale.bandwidth())
        .attr("fill", d => colorScale(d.count))
    //.attr("fill", "teal")
    //const color = d3.scaleBand().range['#0000b4', 'black', '#0094ff', '#0d4bcf', '#0066AE']
    //const colorScale = d3.scaleLinear().domain([0, d3.max(data, d => d.count) + 30]).range(["teal", "blue"])

    //.attr(colors = ['#0000b4', '#0082ca', '#0094ff', '#0d4bcf', '#0066AE']);

    // append text
    const text = svg
        .selectAll("text")
        .data(data)
        .join("text")
        .attr("class", "label")
        // this allows us to position the text in the center of the bar
        .attr("y", d => yScale(d.activity))
        //.text(d => d.activity)
        .attr("x", d => xScale(d.count))


        .text(d => d.count)
        .attr("dy", "1.8em")
    //.attr("dx", "-.8");

    svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(80,10)`)
        .call(yAxis);

    svg
        .append("g")
        .attr("class", "axis") // .attr("class, "axis") - x axis shows up on the top
    // .attr("transform", 'translate(0,0)')
    //.call(xAxis);
});