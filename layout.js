d3.csv("cleaned.csv").then(function(org) {

  const tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .style("background", "#000")
  .style("color", "#FFF")
  .style("padding", "5px")

  // Weekly - line chart plot by days of week
  { 
    const margin = {top: 30, right: 20, bottom: 50, left: 80},
    width = 450 - margin.left - margin.right,
    height = 210 - margin.top - margin.bottom;

  const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

  const svg = d3.select("#weekly")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  const daywise = []
  // 0 -> Sunday to 6 -> Saturday
  for(let i=0; i<7; i++) {
    daywise.push(0)
  }

  org.forEach(function (d) {
    date = parseDate(d.Time)
    daywise[date.getDay()]++;
  })

  const data = [
    {
      "Day": "Sun",
      "Accidents": daywise[0]
    },
    {
      "Day": "Mon",
      "Accidents": daywise[1]
    },
    {
      "Day": "Tue",
      "Accidents": daywise[2]
    },
    {
      "Day": "Wed",
      "Accidents": daywise[3]
    },
    {
      "Day": "Thu",
      "Accidents": daywise[4]
    },
    {
      "Day": "Fri",
      "Accidents": daywise[5]
    },
    {
      "Day": "Sat",
      "Accidents": daywise[6]
    }
  ]

  const x = d3.scaleBand()
        .range([0, width])
        .domain(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
  const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(daywise)]);

  const line = d3.line()
    .x(function(d) { return x(d.Day) + x.bandwidth()/2; })
    .y(function(d) { return y(d.Accidents); });

    svg.append("text")
    .attr("x", -55)
    .attr("y", height / 2)
    .attr("font-size", "10px")
    .text(`Accidents`)
    .attr("transform", `rotate(-90 -55, ${height / 2})`)

    svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + 35)
    .attr("font-size", "10px")
          .style("text-anchor", "middle")
          .text(`Weekday`)

  svg.append("g")
      .attr("class", "x weekly-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
  

  svg.append("g")
      .attr("class", "y weekly-axis")
      .call(d3.axisLeft(y))
    .append("text")


  svg.append("path")
      .datum(data)
      .attr("class", "weekly-line")
      .attr("d", line);

  svg.selectAll(".weekly-dot")
    .data(data)
  .enter().append("circle") 
    .attr("class", "weekly-dot") 
    .attr("cx", function(d) { return x(d.Day) + x.bandwidth()/2 })
    .attr("cy", function(d) { return y(d.Accidents) })
    .attr("r", 5)
    
  svg.selectAll(".weekly-values")
    .data(data)
    .enter().append("text")
    .attr("class", "weekly-values") 
    .attr("x", d => {return x(d.Day) + x.bandwidth()/2})
          .attr("y", d => {return y(d.Accidents) - 14})
          .style("text-anchor", "middle")
          .text(d => d.Accidents)
  }

  // Weather - pie chart
  {
    const margin = {top: 30, right: 30, bottom: 30, left: 30},
    width = 300 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    const svg = d3.select("#weather")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + (width + margin.left + margin.right)/2 + "," + (height + margin.top + margin.bottom)/2 + ")");
    // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let arc = d3.arc()
        .innerRadius(0)
        .outerRadius(Math.min(width, height) / 2 - 1)

    const radius = Math.min(width, height) / 2 * 0.8;
    let arcLabel = d3.arc().innerRadius(radius).outerRadius(radius);

    pie = d3.pie()
        .sort(null)
        .value(d => d.value)

      let store = {}


  org.forEach(d => {
    if(!store.hasOwnProperty(d.Weather))
      store[d.Weather] = 0;
    store[d.Weather]++;
  });

  data = []

  let total = 0

  for (const [key, value] of Object.entries(store)) {
    total += value;
  }

  let others = 0;

  for (const [key, value] of Object.entries(store)) {
    const perc = Math.ceil(value * 100 / total)
    if(perc < 5) {
      others += value
      continue;
    }
    data.push(
      {
        "name": key,
        "value": value,
        "percentage": perc
      }
    )
  }

  data.push({
    "name": "others",
    "value": others,
    "percentage": Math.ceil(others * 100 / total)
  })

  let color = d3.scaleOrdinal()
    .domain(data.map(d => d.name))
    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

  const arcs = pie(data);

  svg.append("g")
      .attr("stroke", "white")
    .selectAll("path")
    .data(arcs)
    .join("path")
      .attr("fill", d => color(d.data.name))
      .attr("d", arc)
    .on("mouseover", d => { tooltip.text(`${d.data.value}`); return tooltip.style("visibility", "visible"); })
    .on("mousemove", () => { return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px"); })
    .on("mouseout", (d) => { return tooltip.style("visibility", "hidden"); });

  svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
    .selectAll("text")
    .data(arcs)
    .join("text")
      .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
      .call(text => text.append("tspan")
          .attr("y", "-0.4em")
          .attr("font-weight", "bold")
          .text(d => d.data.name))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
          .attr("x", 0)
          .attr("y", "0.7em")
          .attr("fill-opacity", 0.7)
          .text(d => `${d.data.percentage}%`))

  }

  // Time of day - bar plot
  {
    const margin = {top: 20, right: 20, bottom: 50, left: 80},
    width = 500 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

const barPlot = d3.select("#time_of_day")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    hourwise = []
  for(let i=0; i<24; i++) {
    hourwise.push(0)
  }

  org.forEach(function (d) {
    date = parseDate(d.Time)
    hourwise[date.getHours()]++;
  })

  const data = [];

  hourwise.forEach((v, i) => {
    data.push({
      "Hours": `${i}`,
      "Accidents": v
    })
  })

  const dom = [];

  for(let i=0; i<24; i++) {
    dom.push(`${i}`)
  }

  const barHeightScale = d3.scaleLinear().domain([0, d3.max(hourwise)]).range([height, 0]);

  const nameScale = d3.scaleBand()
    .domain(dom)
    .rangeRound([0, width])
    .padding(0.1)

  const leftAxis = d3.axisLeft(barHeightScale)

    barPlot.selectAll("g").remove();
    barPlot.selectAll("text").remove();

    barPlot.append('g')
      .call(leftAxis)
      .attr('transform', `translate(0, 0)`)

    barPlot.append("text")
      .attr("x", -50)
      .attr("y", height / 2)
      .attr("font-size", "10px")
      .text(`Accidents`)
      .attr("transform", `rotate(-90 -45, ${height / 2})`)

    const bottomAxis = d3.axisBottom(nameScale)

    barPlot.append('g')
      .call(bottomAxis)
      .attr('transform', `translate(0, ${height})`)

    barPlot.append("text")
      .attr("x", width / 2)
      .attr("y", height + 35)
      .attr("font-size", "10px")
          .style("text-anchor", "middle")
          .text(`Hour`)

      console.log(data)

    const bars = barPlot.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('fill', 'steelblue')
      .attr('x', d => nameScale(d.Hours))
      .attr('y', d => barHeightScale(d.Accidents))
      .attr('width', nameScale.bandwidth())
      .attr('height', d => barHeightScale(0) - barHeightScale(d.Accidents))
      .on("mouseover", d => { tooltip.text(`${d.Accidents}`); return tooltip.style("visibility", "visible"); })
      .on("mousemove", () => { return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px"); })
      .on("mouseout", (d) => { return tooltip.style("visibility", "hidden"); });

  }

});
