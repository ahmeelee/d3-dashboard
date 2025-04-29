let selectedCategory = null;
let selectedTimeRange = null;

d3.csv("Chocolate-Sales.csv").then(raw => {
  const parseDate = d3.timeParse("%d-%b-%y");
  const formatDate = d3.timeFormat("%Y-%m-%d");

  const data = raw.map(d => ({
    Country: d.Country,
    Product: d.Product,
    Date: formatDate(parseDate(d.Date)),
    Amount: +d.Amount.replace(/[\$,]/g, "")
  }));

  updateTable(data);

  const tsMap = d3.rollup(
    data,
    v => d3.sum(v, d => d.Amount),
    d => d.Date
  );
  const timeSeriesData = Array.from(tsMap, ([date, value]) => ({ date, value })).sort((a, b) => new Date(a.date) - new Date(b.date));
  renderAreaChart(timeSeriesData, data);

  const barMap = d3.rollup(
    data,
    v => d3.sum(v, d => d.Amount),
    d => d.Product
  );
  const barData = Array.from(barMap, ([Category, Total]) => ({ Category, Total }))
    .sort((a, b) => d3.descending(a.Total, b.Total))
    .slice(0, 10);
  renderBarChart(barData);

  // 테이블 렌더링
  function updateTable(fullData) {
    const container = d3.select("#data-table");
    container.html("");

    let filtered = fullData;

    if (selectedTimeRange) {
      const parseDate = d3.timeParse("%Y-%m-%d");

      filtered = fullData.filter(d => {
        const saleDate = parseDate(d.Date);
        return saleDate >= selectedTimeRange[0] && saleDate <= selectedTimeRange[1];
      });
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
        renderBarChart(barData);
      });

    rows.selectAll("td")
      .data(d => columns.map(key => d[key]))
      .enter()
      .append("td")
      .text(d => d);
  }

  // 시계열 차트 (브러시 포함)
  function renderAreaChart(rawData, fullData) {
    const parse = d3.timeParse("%Y-%m-%d");
    const data = rawData.map(d => ({ date: parse(d.date), value: +d.value }));

    const margin = { top: 20, right: 30, bottom: 100, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    const contextHeight = 60;

    const svg = d3.select("#area-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom + contextHeight + 40);

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

    const area = d3.area()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.value));

    const areaContext = d3.area()
      .x(d => xContext(d.date))
      .y0(contextHeight)
      .y1(d => yContext(d.value));

    focus.append("path")
      .datum(data)
      .attr("fill", "#69b3a2")
      .attr("d", area);

    focus.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    focus.append("g")
      .call(d3.axisLeft(y));

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
          updateTable(fullData);
          return;
        }
        const [x0, x1] = event.selection.map(xContext.invert);
        x.domain([x0, x1]);
        focus.select("path").attr("d", area);
        focus.select("g").call(d3.axisBottom(x));

        selectedTimeRange = [x0, x1];
        updateTable(fullData);
      });

    context.append("g")
      .attr("class", "brush")
      .call(brush);
  }

  // Bar Chart
  function renderBarChart(data) {
    d3.select("#bar-chart").html("");

    const margin = { top: 30, right: 20, bottom: 40, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select("#bar-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.Category))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Total)])
      .range([height, 0]);

    svg.append("g")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.Category))
      .attr("y", d => y(d.Total))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.Total))
      .attr("fill", d => d.Category === selectedCategory ? "#f28e2c" : "#4682b4");

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g")
      .call(d3.axisLeft(y));
  }
});