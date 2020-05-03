const tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .style("background", "#000")
  .style("color", "#FFF")
  .style("padding", "5px")

  const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

  // Monthly - line chart
const plotMonthly = (out) => { 
  d3.select("#monthly").selectAll("*").remove();
  const margin = {top: 60, right: 20, bottom: 50, left: 80},
  width = 500 - margin.left - margin.right,
  height = 250 - margin.top - margin.bottom;


const svg = d3.select("#monthly")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


const monthwise = []
// 0 -> Sunday to 6 -> Saturday
for(let i=0; i<12; i++) {
  monthwise.push(0)
}

out.forEach(function (d) {
  date = parseDate(d.Time)
  monthwise[date.getMonth()]++;
})

const data = [
  {
    "Month": "Jan",
    "Accidents": monthwise[0]
  },
  {
    "Month": "Feb",
    "Accidents": monthwise[1]
  },
  {
    "Month": "Mar",
    "Accidents": monthwise[2]
  },
  {
    "Month": "Apr",
    "Accidents": monthwise[3]
  },
  {
    "Month": "May",
    "Accidents": monthwise[4]
  },
  {
    "Month": "June",
    "Accidents": monthwise[5]
  },
  {
    "Month": "July",
    "Accidents": monthwise[6]
  },
  {
    "Month": "Aug",
    "Accidents": monthwise[7]
  },
  {
    "Month": "Sept",
    "Accidents": monthwise[8]
  },
  {
    "Month": "Oct",
    "Accidents": monthwise[9]
  },
  {
    "Month": "Nov",
    "Accidents": monthwise[10]
  },
  {
    "Month": "Dec",
    "Accidents": monthwise[11]
  }
]

const x = d3.scaleBand()
      .range([0, width])
      .domain(["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]);
const y = d3.scaleLinear()
          .range([height, 0])
          .domain([0, d3.max(monthwise)]);

const line = d3.line()
  .x(function(d) { return x(d.Month) + x.bandwidth()/2; })
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
        .text(`Month`)

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
  .attr("cx", function(d) { return x(d.Month) + x.bandwidth()/2 })
  .attr("cy", function(d) { return y(d.Accidents) })
  .attr("r", 5)
  
svg.selectAll(".weekly-values")
  .data(data)
  .enter().append("text")
  .attr("class", "weekly-values") 
  .attr("x", d => {return x(d.Month) + x.bandwidth()/2})
        .attr("y", d => {return y(d.Accidents) - 14})
        .attr("font-size", "10px")
        .style("text-anchor", "middle")
        .text(d => d.Accidents)
}

d3.csv("../../cleaned.csv").then(function(tot) {

  const out = []
  for(let i=0; i<12; i++) {
    out.push([])
  }
  plotMonthly(tot)
  const inp = _.sample(tot, tot.length/10);

  inp.forEach(function (d) {
    date = parseDate(d.Time)
    out[date.getMonth()].push(d);
  })

  // Table of data
  {
    const show = _.sample(inp, 100);

    let tr = d3.select("tbody").selectAll("tr")
      .data(show)
      .enter().append("tr");
  
    tr.selectAll("td")
        .data(d => {return [d.ID, d.Source, d.Severity, d.Time, d.Lat, d.Lng, d.Description, d.State, d.Weather, d.Object]})
        .enter()
        .append("td")
        .text(function(d) { return d; });
  }

  createPlots(out);
});


const createPlots = (out) => {

  // Weekly - line chart plot by days of week
  const plotWeekly = (out) => { 
    d3.select("#weekly").selectAll("*").remove();
    const margin = {top: 30, right: 20, bottom: 50, left: 55},
    width = 250 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

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

  out.forEach(function (d) {
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
    .attr("x", -40)
    .attr("y", height / 2)
    .attr("font-size", "10px")
    .text(`Accidents`)
    .attr("transform", `rotate(-90 -40, ${height / 2})`)

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
          .attr("font-size", "10px")
          .style("text-anchor", "middle")
          .text(d => d.Accidents)
  }

  // Weather - pie chart
  const plotWeather = (out) => {
    d3.select("#weather").selectAll("*").remove();
    const margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 250 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

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


  out.forEach(d => {
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
    "name": "Others",
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
  const plotTime = (out) => {
    d3.select("#time_of_day").selectAll("*").remove();
    const margin = {top: 20, right: 20, bottom: 50, left: 80},
    width = 430 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

const barPlot = d3.select("#time_of_day")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    hourwise = []
  for(let i=0; i<24; i++) {
    hourwise.push(0)
  }

  out.forEach(function (d) {
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

  // Map 
  const plotMapMonth = (out) => {
    let mapping = {
      AL: "Alabama",
      AK: "Alaska",
      AS: "American Samoa",
      AZ: "Arizona",
      AR: "Arkansas",
      CA: "California",
      CO: "Colorado",
      CT: "Connecticut",
      DE: "Delaware",
      DC: "District Of Columbia",
      FM: "Federated States Of Micronesia",
      FL: "Florida",
      GA: "Georgia",
      GU: "Guam",
      HI: "Hawaii",
      ID: "Idaho",
      IL: "Illinois",
      IN: "Indiana",
      IA: "Iowa",
      KS: "Kansas",
      KY: "Kentucky",
      LA: "Louisiana",
      ME: "Maine",
      MH: "Marshall Islands",
      MD: "Maryland",
      MA: "Massachusetts",
      MI: "Michigan",
      MN: "Minnesota",
      MS: "Mississippi",
      MO: "Missouri",
      MT: "Montana",
      NE: "Nebraska",
      NV: "Nevada",
      NH: "New Hampshire",
      NJ: "New Jersey",
      NM: "New Mexico",
      NY: "New York",
      NC: "North Carolina",
      ND: "North Dakota",
      MP: "Northern Mariana Islands",
      OH: "Ohio",
      OK: "Oklahoma",
      OR: "Oregon",
      PW: "Palau",
      PA: "Pennsylvania",
      PR: "Puerto Rico",
      RI: "Rhode Island",
      SC: "South Carolina",
      SD: "South Dakota",
      TN: "Tennessee",
      TX: "Texas",
      UT: "Utah",
      VT: "Vermont",
      VI: "Virgin Islands",
      VA: "Virginia",
      WA: "Washington",
      WV: "West Virginia",
      WI: "Wisconsin",
      WY: "Wyoming",
    };
    byStates = {}
    for(st in mapping) {
      byStates[mapping[st]] = out.filter((ele) => {
        if (mapping[ele.State] == mapping[st]) {
          return ele;
        }
      });
    }

    let width = 975,
      height = 610,
      centered;
    let csv = [];
    let arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(Math.min(width, height) / 3 - 1);
    
    const radius = (Math.min(width, height) / 3) * 0.5;
    let arcLabel = d3.arc().innerRadius(radius).outerRadius(radius);
    
    pie = d3
      .pie()
      .sort(null)
      .value((d) => d.value);
    
    let totalAccidentsByStates;
    // d3.csv("../../test.csv").then((out) => {
      out.forEach((d) => {
        csv.push([d.Lng, d.Lat, d.State, d.Severity]);
      });
      totalAccidentsByStates = d3.rollup(
        out,
        (v) => v.length,
        (d) => mapping[d.State]
      );
      const projection = d3
        .geoAlbersUsa()
        .scale(1300)
        .translate([width / 2, height / 2]);
      const path = d3.geoPath();
      var scatterPlot;
      var legendPlot;
      const svg = d3
        .select("#map")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(-130, -80) scale(0.7)")
      var g;
      let statePlot;
      d3.json("../../USA-states.json").then((us) => {
        setTimeout(() => {
          d3.select("#map").selectAll("*").remove();
          g = svg.append("g");
          let color = d3
            .scaleQuantile()
            .domain(Array.from(totalAccidentsByStates, (d) => d[1]))
            .range(d3.schemeBlues[5]);
          // console.log(us);
          let legend = d3
            .legendColor()
            .scale(color)
            .labelFormat(d3.format("d"))
            .shapeWidth(25)
            .labels(d3.legendHelpers.thresholdLabels)
            // .orient('horizontal')
            .title("Number of Accidents per state")
            .titleWidth(115);
          legendPlot = svg
            .append("g")
            .attr("class", "legend")
            .attr(
              "transform",
              "translate(+" + (width - 150) + "," + (height - 200) + ")"
            )
            .call(legend);
          g.append("g")
            .attr("id", "states")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", (d) =>
              color(totalAccidentsByStates.get(d.properties.name) | 0)
            )
            .on("click", clicked)
            .append("title")
            .text(
              (d) => `${d.properties.name}
        ${totalAccidentsByStates.get(d.properties.name) | 0}`
            );
          g.append("path")
            .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
            .attr("id", "state-borders")
            .attr("d", path);
          scatterPlot = svg
            .append("g")
            .attr("fill", "brown")
            .selectAll("circle")
            .data(csv)
            .join("circle")
            .attr("transform", (d) => `translate(${projection([d[0], d[1]])})`)
            .attr("r", 1);
          }, 500);
        });
      
    
      // console.log(byStates)
      let colorPie = d3
      .scaleQuantile()
      .domain(["1","2","3","4"])
      .range(
        // d3
        //   .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1),4)
        //   .reverse()
        d3.schemeReds[4]
      );

      function clicked(d) {
        let x, y, k;
        if (d && centered !== d) {
          // scatterPlot.attr("visibility", "hidden");
          scatterPlot.attr("class", "hid");
          legendPlot.attr("class", "hid");
          // legendPlot.attr("visibility", "hidden");
          // legendPlot.remove()
          let filteredset = byStates[d.properties.name]
          plotTime(filteredset)
          plotWeather(filteredset)
          plotWeekly(filteredset)
          let centroid = path.centroid(d);
          x = centroid[0];
          y = centroid[1];
          k = 3;
          centered = d;
          if (statePlot != undefined) {
            statePlot.remove();
          }

          let store = {};

          filteredset.forEach((d) => {
            if (!store.hasOwnProperty(d.Severity)) 
              store[d.Severity] = 0;
            store[d.Severity]++;
          });
    
          data = [];
    
          let total = 0;
    
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

          // data.push({
          //   "name": "Others",
          //   "value": others,
          //   "percentage": Math.ceil(others * 100 / total)
          // })


          const arcs = pie(data);

          setTimeout(() => {
            // statePlot = svg
            //   .append("g")
            //   .attr("fill", "blue")
            //   .attr("stroke", "black")
            //   .selectAll("circle")
            //   .data(filteredset)
            //   .join("circle")
            //   // .attr("cx", (d) => pro([d[0], d[1]])[0])
            //   // .attr("cy", (d) => pro([d[0], d[1]])[1])
            //   .attr("transform", (ele) => {
            //     console.log(ele, pro([ele[0], ele[1]]));
            //     return `translate(${pro([ele[0], ele[1]])})`;
            //   })
            //   .attr("r", (ele) => {
            //     let temp = ele[3];
            //     if (temp == 2) {
            //       return 3;
            //     } else if (temp == 3) {
            //       return 6;
            //     } else if (temp == 4) {
            //       return 10;
            //     } else {
            //       return 1;
            //     }
            //   });
    
            statePlot = svg
              .append("g")
              // .attr("stroke", "white")
              .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
            // .attr("visibility", "visible")
            statePlot
              .selectAll("path")
              .data(arcs)
              .enter()
              .append("path")
              .attr("fill", (d) => colorPie(d.data.name))
              .attr("d", arc)
              .on("mouseover", d => { tooltip.text(`${d.data.value}`); return tooltip.style("visibility", "visible"); })
              .on("mousemove", () => { return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px"); })
              .on("mouseout", (d) => { return tooltip.style("visibility", "hidden"); });
              
            statePlot
              .append("g")
              .attr("font-family", "sans-serif")
              .attr("font-size", 20)
              .attr("text-anchor", "middle")
              .selectAll("text")
              .data(arcs)
              .join("text")
              .attr("transform", (d) => `translate(${arcLabel.centroid(d)})`)
              .call((text) =>
                text
                  .append("tspan")
                  .attr("y", "-0.4em")
                  .attr("font-weight", "bold")
                  .text((d) => {
                    if(d.data.name == 4) return "Severe"
                    else if(d.data.name == 3) return "High"
                    else if(d.data.name == 2) return "Medium"
                    // else if(d.data.name == "Others") return "Others"
                    else return "Low"
                  })
              )
              .call((text) =>
                text
                  .filter((d) => d.endAngle - d.startAngle > 0.25)
                  .append("tspan")
                  .attr("x", 0)
                  .attr("y", "0.7em")
                  .attr("fill-opacity", 0.7)
                  .text((d) => `${d.data.percentage}%`)
              );
          }, 600);
          console.log(2);
        } else {
          setTimeout(() => {
            scatterPlot.attr("class", "vis");
            legendPlot.attr("class", "vis");
          }, 650);
          statePlot.attr("class", "hid");
          statePlot.remove();
          x = width / 2;
          y = height / 2;
          k = 1;
          centered = null;
          console.log(1)
        }
    
        g.selectAll("path").classed(
          "active",
          centered &&
            function (d) {
              return d === centered;
            }
        );
    
        g.transition()
          .duration(650)
          .attr(
            "transform",
            "translate(" +
              width / 2 +
              "," +
              height / 2 +
              ")scale(" +
              k +
              ")translate(" +
              -x +
              "," +
              -y +
              ")"
          )
          .style("stroke-width", 1.5 / k + "px");
      }
    // });
    
  }


  let stepSlider = document.getElementById('slider');

  noUiSlider.create(stepSlider, {
      start: [1],
      step: 1,
      range: {
          'min': [1],
          'max': [12]
      },
      pips: {
        mode: 'steps',
        density: 3,
        format: wNumb({
            decimals: 0,
        })
    }
  });

  const wholePlot = () => {
    plotTime(inp)
    plotWeather(inp)
    plotWeekly(inp)
  }

  const updatePlots = (mon) => {
    plotMapMonth(out[mon])
    plotTime(out[mon])
    plotWeather(out[mon])
    plotWeekly(out[mon])
  }
  
  updatePlots(0)

  let stepSliderValueElement = document.getElementById('month');

  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];

  stepSlider.noUiSlider.on('update', function (values, handle) {
      const mon = values[handle]-1;
      stepSliderValueElement.innerHTML = monthNames[mon];
      updatePlots(mon);
  });
  

}