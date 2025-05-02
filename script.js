let selectedCategory = null;
let selectedTimeRange = null;
let selectedDate = null;

let fullData = [];
let barDataFull = [];

d3.csv("Chocolate-Sales.csv").then(raw => {
  const parseDate = d3.timeParse("%d-%b-%y");
  const formatDate = d3.timeFormat("%Y-%m-%d");

  fullData = raw.map(d => ({
    Country: d.Country,
    Product: d.Product,
    Date: formatDate(parseDate(d.Date)),
    Amount: +d.Amount.replace(/[$,]/g, "")
  }));

  const tsMap = d3.rollup(fullData, v => d3.sum(v, d => d.Amount), d => d.Date);
  const timeSeriesData = Array.from(tsMap, ([date, value]) => ({ date, value })).sort((a, b) => new Date(a.date) - new Date(b.date));
  renderAreaChart(timeSeriesData);

  const barMap = d3.rollup(fullData, v => d3.sum(v, d => d.Amount), d => d.Product);
  barDataFull = Array.from(barMap, ([Category, Total]) => ({ Category, Total })).sort((a, b) => d3.descending(a.Total, b.Total));

  renderBarChart();
  updateTable();

  document.getElementById("search-input").addEventListener("input", updateTable);
  document.getElementById("top-n-select").addEventListener("change", renderBarChart);
});

function updateTable() {
  const container = d3.select("#data-table");
  container.html("");

  const searchText = document.getElementById("search-input").value.toLowerCase();
  let filtered = fullData;

  if (selectedTimeRange) {
    const parseDate = d3.timeParse("%Y-%m-%d");
    filtered = filtered.filter(d => {
      const saleDate = parseDate(d.Date);
      return saleDate >= selectedTimeRange[0] && saleDate <= selectedTimeRange[1];
    });
  }

  if (selectedCategory) {
    filtered = filtered.filter(d => d.Product === selectedCategory);
  }

  if (selectedDate) {
    filtered = filtered.filter(d => d.Date === selectedDate);
  }

  if (searchText) {
    filtered = filtered.filter(d => d.Product.toLowerCase().includes(searchText));
  }

  const table = container.append("table");
  const thead = table.append("thead");
  const tbody = table.append("tbody");
  const columns = Object.keys(filtered[0]);

  thead.append("tr")
    .selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .text(d => d);

  const rows = tbody.selectAll("tr")
    .data(filtered)
    .enter()
    .append("tr")
    .on("click", function(event, d) {
      d3.selectAll("tr").style("background-color", null);
      d3.select(this).style("background-color", "#e6f7ff");
      selectedCategory = d.Product;
      selectedDate = null;
      renderBarChart();
      renderAreaChartAgain();
      updateTable();
    });

  rows.selectAll("td")
    .data(d => columns.map(key => d[key]))
    .enter()
    .append("td")
    .text(d => d);
}

function renderAreaChart(rawData) {
  d3.select("#area-chart").html("");

  const parse = d3.timeParse("%Y-%m-%d");
  const format = d3.timeFormat("%Y-%m-%d");
  const data = rawData.map(d => ({ date: parse(d.date), value: +d.value }));

  const margin = { top: 20, right: 30, bottom: 100, left: 40 };
  const width = 800 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;
  const contextHeight = 60;

  const svg = d3.select("#area-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom + contextHeight + 40}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .classed("responsive-svg", true);

  const focus = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  const context = svg.append("g").attr("transform", `translate(${margin.left},${height + margin.top + 40})`);

  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);
  const xContext = d3.scaleTime().range([0, width]);
  const yContext = d3.scaleLinear().range([contextHeight, 0]);

  x.domain(d3.extent(data, d => d.date));
  y.domain([0, d3.max(data, d => d.value)]);
  xContext.domain(x.domain());
  yContext.domain(y.domain());

  const area = d3.area().x(d => x(d.date)).y0(height).y1(d => y(d.value));
  const areaContext = d3.area().x(d => xContext(d.date)).y0(contextHeight).y1(d => yContext(d.value));

  const focusPath = focus.append("path")
    .datum(data)
    .attr("fill", "#69b3a2")
    .attr("d", area);

  focus.selectAll("circle").remove();

  focus.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.date))
    .attr("cy", d => y(d.value))
    .attr("r", 3)
    .attr("fill", d => selectedDate && format(d.date) === selectedDate ? "orange" : "steelblue")
    .style("cursor", "pointer")
    .on("click", function(event, d) {
      const clickedDate = format(d.date);
      selectedDate = (selectedDate === clickedDate) ? null : clickedDate;
      selectedCategory = null;
      renderBarChart();
      renderAreaChartAgain();
      updateTable();
    });

  focus.selectAll(".x-axis").remove();
  focus.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  focus.append("g").call(d3.axisLeft(y));

  context.append("path")
    .datum(data)
    .attr("fill", "#ccc")
    .attr("d", areaContext);

  context.append("g")
    .attr("transform", `translate(0,${contextHeight})`)
    .call(d3.axisBottom(xContext));

  const brush = d3.brushX()
    .extent([[0, 0], [width, contextHeight]])
    .on("brush end", event => {
      if (!event.selection) {
        selectedTimeRange = null;
        updateTable();
        return;
      }
      const [x0, x1] = event.selection.map(xContext.invert);
      x.domain([x0, x1]);
      focusPath.attr("d", area);

      focus.selectAll(".x-axis").remove();
      focus.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      focus.selectAll("circle")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.value));

      selectedTimeRange = [x0, x1];
      updateTable();
    });

  context.append("g")
    .attr("class", "brush")
    .call(brush);
}

function renderAreaChartAgain() {
  const tsMap = d3.rollup(fullData, v => d3.sum(v, d => d.Amount), d => d.Date);
  const timeSeriesData = Array.from(tsMap, ([date, value]) => ({ date, value })).sort((a, b) => new Date(a.date) - new Date(b.date));
  renderAreaChart(timeSeriesData);
}

function renderBarChart() {
  d3.select("#bar-chart").html("");

  const topN = +document.getElementById("top-n-select").value;
  const data = barDataFull.slice(0, topN);
  const margin = { top: 30, right: 20, bottom: 40, left: 60 };
  const width = 600 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;
  const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

  const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .classed("responsive-svg", true);

  const chart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand().domain(data.map(d => d.Category)).range([0, width]).padding(0.2);
  const y = d3.scaleLinear().domain([0, d3.max(data, d => d.Total)]).range([height, 0]);

  chart.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => x(d.Category))
    .attr("y", d => y(d.Total))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.Total))
    .attr("fill", d => colorScale(d.Category))
    .attr("opacity", d => selectedCategory === null || selectedCategory === d.Category ? 1 : 0.3)
    .style("cursor", "pointer")
    .on("click", function(event, d) {
      selectedCategory = (selectedCategory === d.Category) ? null : d.Category;
      selectedDate = null;
      renderBarChart();
      renderAreaChartAgain();
      updateTable();
    });

  chart.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  chart.append("g").call(d3.axisLeft(y));
}
