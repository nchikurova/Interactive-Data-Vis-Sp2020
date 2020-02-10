// load in csv
d3.csv("../data/TaxiAppProject.csv").then(data => {
    // once the data loads, console log it
    console.log("data", data);

    // select the `table` container in the HTML
    const table = d3.select("#d3-table");

    /** HEADER */
    const thead = table.append("thead");
    thead
        .append("tr")
        .append("th")
        .attr("colspan", "7")
        .text("Interactive Data Visualization Tutorial 1");

    thead
        .append("tr")
        .selectAll("th")
        .data(data.columns)
        .join("td")
        .text(d => d);

    /** BODY */
    // rows
    const rows = table
        .append("tbody")
        .selectAll("tr")
        .data(data)
        .join("tr")
    // .attr("class", d => {
    //     console.log(d);
    //     let tag;
    //     if (+d.Price > 7) {
    //         tag = "expensive";
    //     }

    //     if (+d.Price < 7) {
    //         tag = "cheap"
    //     }

    //     return tag;

    // });

    // cells
    rows
        .selectAll("td")
        .data(d => Object.entries(d))
        .join("td")
        .style("background-color", d => {
            console.log(d)
            let color
            if (d[0] === "Price" && +d[1] > 7) {
                color = "salmon"
            }

            return color
        })
        // .attr("class", d => {
        //     console.log(d)
        //     let tag
        //     if (d[0] === "Price" && +d[1] > 7) {
        //         tag = "expensive"
        //     }
        //     return tag
        // })
        // update the below logic to apply to your dataset

        
        .text(d => d[1]);


});