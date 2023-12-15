// Width and height
const w = 850;
const h = 350;
const margin = {top: 50, right: 100, bottom: 75, left: 100};
const innerHeight = h - margin.top - margin.bottom;
const innerWidth = w - margin.left - margin.right;

// create SVG element
const svg = d3.select("div#plot")
  .append("svg")
    .attr("width", w)
    .attr("height", h)

// create background rectangle
svg.append("rect")
.attr("width", w)
.attr("height", h)
.attr("fill", "#e7f5fe");

// create caption
d3.select("div#plot")
.append("div")
  .style("padding", "10px")
.append("a")
.text("Green: Renewable Energy, Pink: Fossil Fuels, Blue: Nuclear Electric Power");

// create plot group
svg.append("g")
  .attr("id", "plot")
  .attr("transform", `translate (${margin.left}, ${margin.top})`);

const rowConverter = function (d) {
  return {
    year: +d.Year,
    cons: +d['Consumption'],
    s_cons: +d['Scaled Consumption']
    }
};

d3.csv("https://raw.githubusercontent.com/Amy0Shen/energy/main/Yearly%20Consumption.csv", rowConverter).then(function(data) {

// Set up x-axis scale, which is in years
xScale = d3.scaleBand()
  .domain(data.map(d => d.year))
  .range([0, innerWidth])
  .paddingInner(.1);

// Set up y-aixs scale, which is in Quadrillion Btu
yScale = d3.scaleLinear()
  .domain([0, 110])
  .range([innerHeight, 0]);

xAxis = d3.axisBottom()
  .scale(xScale);

yAxis = d3.axisLeft()
  .scale(yScale);

// Create Bars for Nuclear Electric Power
svg.select("g#plot")
  .selectAll("rect")
  .data(data.slice(0, 30))
  .enter()
  .append("rect")
  .attr("x", d => xScale(d.year))
  .attr("y", d => yScale(d.cons))
  .attr("width", xScale.bandwidth())
  .attr("height", d => innerHeight - yScale(d.cons))
  .attr("fill", "lightblue")
  .on("mouseover", function(event, d) {
        const xcoord = +d3.select(event.currentTarget).attr("x") + 5
        const ycoord = +d3.select(event.currentTarget).attr("y") - 5
        svg.select("g#plot")
          .append("text")
          .attr("id", "tooltip")
          .attr("x", xcoord)
          .attr("y", ycoord)
          .text(`Amount: ${d.cons}, Proportion: ${d.s_cons}`)
          .attr("fill", "blue")
          .attr("text-anchor", "middle");
     })
     .on("mouseout", function() {
         d3.select("#tooltip")
           .remove();
     }
     );

// Create Bars for Fossil Fuels
svg.select("g#plot")
  .selectAll("rect")
  .data(data.slice(0, 60))
  .enter()
  .append("rect")
  .attr("x", d => xScale(d.year))
  .attr("y", (d, i) => yScale(data[i -30].cons + d.cons))
  .attr("width", xScale.bandwidth())
  .attr("height", d => innerHeight - yScale(d.cons))
  .attr("fill", "pink")
  .on("mouseover", function(event, d) {
        const xcoord = +d3.select(event.currentTarget).attr("x") + 5
        const ycoord = +d3.select(event.currentTarget).attr("y") - 5
        svg.select("g#plot")
          .append("text")
          .attr("id", "tooltip")
          .attr("x", xcoord)
          .attr("y", ycoord)
          .text(`Amount: ${d.cons}, Proportion: ${d.s_cons}`)
          .attr("fill", "blue")
          .attr("text-anchor", "middle");
     })
     .on("mouseout", function() {
         d3.select("#tooltip")
           .remove();
     }
     );

// Create Bars for Renewable Energy
svg.select("g#plot")
  .selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", d => xScale(d.year))
  .attr("y", (d, i) => yScale(data[i -60].cons + data[i -30].cons + d.cons))
  .attr("width", xScale.bandwidth())
  .attr("height", d => innerHeight - yScale(d.cons))
  .attr("fill", "lightgreen")
  .on("mouseover", function(event, d) {
        const xcoord = +d3.select(event.currentTarget).attr("x") + 5
        const ycoord = +d3.select(event.currentTarget).attr("y") - 5
        svg.select("g#plot")
          .append("text")
          .attr("id", "tooltip")
          .attr("x", xcoord)
          .attr("y", ycoord)
          .text(`Amount: ${d.cons}, Proportion: ${d.s_cons}`)
          .attr("fill", "blue")
          .attr("text-anchor", "middle");
     })
     .on("mouseout", function() {
         d3.select("#tooltip")
           .remove();
     }
     );

// create x-axis
svg.select("g#plot")
  .append("g")
  .attr("transform", `translate (0, ${innerHeight})`)
  .call(xAxis);

// create x-axis label
svg.select("g#plot")
  .append("text")
    .attr("id", "xlab")
    .attr("x", innerWidth/2)
    .attr("y", innerHeight + .75 * margin.bottom)
    .attr("text-anchor", "middle")
    .text("Year");

// create y-axis
svg.select("g#plot")
  .append("g")
  .call(yAxis)

// create y-axis label
svg.select("g#plot")
  .append("text")
    .attr("id", "ylab")
    .attr("x", 20)
    .attr("y", -40)
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .text("Energy Consumption (Quadrillion Btu)");
}) // end d3.json

.catch(function(error){
  d3.select("svg")
    .append("text")
    .style("font-size", "24px")
    .attr("x", "100")
    .attr("y", "100")
    .text("Error loading data");
});
