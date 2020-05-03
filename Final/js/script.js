$(document).ready(function() {
  $('.ui.dropdown').dropdown();
  $('.sidebar-menu-toggler').on('click', function() {
    var target = $(this).data('target');
    $(target)
      .sidebar({
        dinPage: true,
        transition: 'overlay',
        mobileTransition: 'overlay'
      })
      .sidebar('toggle');
  });
});


d3.csv("../../cleaned.csv").then(function(out) {

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
    const margin = {top: 60, right: 20, bottom: 50, left: 80},
    width = 450 - margin.left - margin.right,
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
          .attr("font-size", "10px")
          .style("text-anchor", "middle")
          .text(d => d.Accidents)
  }

  // Weather - pie chart
  {
    const margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 230 - margin.left - margin.right,
    height = 230 - margin.top - margin.bottom;

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
    width = 450 - margin.left - margin.right,
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
  {
    let avgCoordinates = {
      Alaska: [-152.2683, 61.385],
      Alabama: [-86.8073, 32.799],
      Arkansas: [-92.3809, 34.9513],
      Arizona: [-111.3877, 33.7712],
      California: [-119.7462, 36.17],
      Colorado: [-105.3272, 39.0646],
      Connecticut: [-72.7622, 41.5834],
      Delaware: [-75.5148, 39.3498],
      Florida: [-81.717, 27.8333],
      Georgia: [-83.6487, 32.9866],
      Hawaii: [-157.5311, 21.1098],
      Iowa: [-93.214, 42.0046],
      Idaho: [-114.5103, 44.2394],
      Illinois: [-89.0022, 40.3363],
      Indiana: [-86.2604, 39.8647],
      Kansas: [-96.8005, 38.5111],
      Kentucky: [-84.6514, 37.669],
      Louisiana: [-91.8749, 31.1801],
      Massachusetts: [-71.5314, 42.2373],
      Maryland: [-76.7902, 39.0724],
      Maine: [-69.3977, 44.6074],
      Michigan: [-84.5603, 43.3504],
      Minnesota: [-93.9196, 45.7326],
      Missouri: [-92.302, 38.4623],
      Mississippi: [-89.6812, 32.7673],
      Montana: [-110.3261, 46.9048],
      "North Carolina": [-79.8431, 35.6411],
      "North Dakota": [-99.793, 47.5362],
      Nebraska: [-98.2883, 41.1289],
      "New Hampshire": [-71.5653, 43.4108],
      "New Jersey": [-74.5089, 40.314],
      "New Mexico": [-106.2371, 34.8375],
      Nevada: [-117.1219, 38.4199],
      "New York": [-74.9384, 42.1497],
      Ohio: [-82.7755, 40.3736],
      Oklahoma: [-96.9247, 35.5376],
      Oregon: [-122.1269, 44.5672],
      Pennsylvania: [-77.264, 40.5773],
      "Rhode Island": [-71.5101, 41.6772],
      "South Carolina": [-80.9066, 33.8191],
      "South Dakota": [-99.4632, 44.2853],
      Tennessee: [-86.7489, 35.7449],
      Texas: [-97.6475, 31.106],
      Utah: [-111.8535, 40.1135],
      Virginia: [-78.2057, 37.768],
      Vermont: [-72.7093, 44.0407],
      Washington: [-121.5708, 47.3917],
      Wisconsin: [-89.6385, 44.2563],
      "West Virginia": [-80.9696, 38.468],
      Wyoming: [-107.2085, 42.7475],
      "District of Columbia": [-77.0268, 38.8974],
      "Puerto Rico": [-66.628, 18.2491],
    };
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
    let width = 975,
      height = 610,
      centered;
    let csv = [];
    let arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(Math.min(width, height) / 2 - 1);
    
    const radius = (Math.min(width, height) / 2) * 0.8;
    let arcLabel = d3.arc().innerRadius(radius).outerRadius(radius);
    
    pie = d3
      .pie()
      .sort(null)
      .value((d) => d.value);
    
    let totalAccidentsByStates;
    d3.csv("../../test.csv").then((out) => {
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
      let scatterPlot1;
      const svg = d3
        .select("#map")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(-130, -80) scale(0.7)")
      const g = svg.append("g");
      let scatterPlot = svg.append("g");
      let statePlot;
      setTimeout(() => {
        d3.json("../../USA-states.json").then((us) => {
          let color = d3
            .scaleQuantile()
            .domain(Array.from(totalAccidentsByStates, (d) => d[1]))
            .range(d3.schemeBlues[8]);
          console.log(us);
          let legend = d3
            .legendColor()
            .scale(color)
            .labelFormat(d3.format("d"))
            .shapeWidth(25)
            .labels(d3.legendHelpers.thresholdLabels)
            // .orient('horizontal')
            .title("Number of Accidents per state")
            .titleWidth(115);
          svg
            .append("g")
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
          scatterPlot1 = svg
            .append("g")
            .attr("fill", "brown")
            .selectAll("circle")
            .data(csv)
            .join("circle")
            .attr("transform", (d) => `translate(${projection([d[0], d[1]])})`)
            .attr("r", 1);
        });
      }, 500);
      function clicked(d) {
        let x, y, k;
        console.log(d);
        if (d && centered !== d) {
          scatterPlot1.attr("visibility", "hidden");
          let filteredset = out.filter((ele) => {
            if (mapping[ele.State] == d.properties.name) {
              return ele;
            }
          });
          let centroid = path.centroid(d);
          x = centroid[0];
          y = centroid[1];
          k = 3;
          centered = d;
          if (statePlot != undefined) statePlot.remove();
          let store = {};
          filteredset.forEach((d) => {
            if (!store.hasOwnProperty(d.Weather)) store[d.Weather] = 0;
            store[d.Weather]++;
          });
    
          data = [];
    
          let total = 0;
    
          for (const [key, value] of Object.entries(store)) {
            total += value;
          }
    
          let others = 0;
    
          for (const [key, value] of Object.entries(store)) {
            const perc = Math.ceil((value * 100) / total);
            if (perc < 5) {
              others += value;
              continue;
            }
            data.push({
              name: key,
              value: value,
              percentage: perc,
            });
          }
    
          data.push({
            name: "others",
            value: others,
            percentage: Math.ceil((others * 100) / total),
          });
    
          let colorPie = d3
            .scaleOrdinal()
            .domain(data.map((d) => d.name))
            .range(
              d3
                .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
                .reverse()
            );
    
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
              .attr("translate", "translate(600,300)")
              .attr("fill", (d) => colorPie(d.data.name))
              .attr("d", arc)
              .append("title")
              .text(
                (d) => `${d.data.name} : ${d.data.value} : ${d.data.percentage}%`
              );
    
            statePlot
              .append("g")
              .attr("font-family", "sans-serif")
              .attr("font-size", 10)
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
                  .text((d) => d.data.name)
              )
              .call((text) =>
                text
                  .filter((d) => d.endAngle - d.startAngle > 0.25)
                  .append("tspan")
                  .attr("x", 0)
                  .attr("y", "0.7em")
                  .attr("fill-opacity", 0.7)
                  .text((d) => `${d.data.value} : ${d.data.percentage}%`)
              );
          }, 700);
        } else {
          setTimeout(() => {
            scatterPlot1.attr("visibility", "visible");
          }, 750);
          statePlot.attr("visibility", "hidden");
          statePlot.remove();
          x = width / 2;
          y = height / 2;
          k = 1;
          centered = null;
        }
    
        g.selectAll("path").classed(
          "active",
          centered &&
            function (d) {
              return d === centered;
            }
        );
    
        g.transition()
          .duration(750)
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
    });
    
  }

});
