d3.csv("../data/squirrelActivitis.csv", d3.autoType).then(data => {
    console.log(data);
    const width = window.innerWidth * 0.3,
        height = window.innerHeight / 2,
        paddingInner = 0.2,
        margin = { top: 20, bottom: 40, left: 40, right: 40 };

    /* Scales*/
    const xScale = d3
        .scaleBand()
        .domain([0, d3.max(data, d => d.count)])
        .range(height - margin.bottom, margin.top);

    const yScale = d3
        .scaleLinear()
        .domain(data.map(d => d.activity))
        .range([margin.left, width - margin.right])
        .paddingInner(paddingInner);

    const xAxis = d3.axisBottom(xScale).ticks(data.length);

    const svg = d3
        .select("d3-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // append rects
    const rect = svg
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("y", d => yScale(d.activity))
        .attr("x", d => xScale(d.count))
        .attr("width", d => width - margin.bottom - xScale(d.activity))
        .attr("height", yScale.bandheight())
        .attr("fill", "steelblue")

    // apend text
    const text = svg
        .selectAll("text")
        .data(data)
        .join("text")
        .attr("class", "label")
        // this allow us to position the text in the center of the bar
        .attr("x", d => xScale(d.count) + (xScale.bandheight() / 2))
        .attr("y", d => yScale(d.activity))
        .text(d => d.count)
        .attr("dy", "1.25em");
    svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", 'translate(0, ${width - margin.bottom})')
        .call(xAxis);





});