// -------------------------------
// 🟢 1. 인터랙티브 테이블
// -------------------------------

const data = [
    { Country: "USA", Category: "Dark", Sales: "120", Price: "2.5" },
    { Country: "France", Category: "Milk", Sales: "90", Price: "2.2" },
    { Country: "Japan", Category: "White", Sales: "70", Price: "1.9" },
    { Country: "Germany", Category: "Dark", Sales: "110", Price: "2.6" },
    { Country: "UK", Category: "Milk", Sales: "80", Price: "2.1" },
    { Country: "Canada", Category: "White", Sales: "75", Price: "2.0" }
  ];
  
  renderTable(data);
  
  function renderTable(data) {
    const container = d3.select("#data-table");
    container.html("");
  
    const table = container.append("table");
    const thead = table.append("thead");
    const tbody = table.append("tbody");
  
    const columns = Object.keys(data[0]);
  
    thead.append("tr")
      .selectAll("th")
      .data(columns)
      .enter()
      .append("th")
      .text(d => d)
      .attr("data-order", "none")
      .on("click", function(event, d) {
        const current = d3.select(this).attr("data-order");
        const ascending = current !== "asc";
        d3.selectAll("th").attr("data-order", "none");
        d3.select(this).attr("data-order", ascending ? "asc" : "desc");
        data.sort((a, b) => ascending ? d3.ascending(a[d], b[d]) : d3.descending(a[d], b[d]));
        renderTable(data);
      });
  
    const rows = tbody.selectAll("tr")
      .data(data)
      .enter()
      .append("tr")
      .on("click", function(event, d) {
        d3.selectAll("tr").style("background-color", null);
        d3.select(this).style("background-color", "#e6f7ff");
        console.log("Selected row:", d);
      });
  
    rows.selectAll("td")
      .data(d => columns.map(key => d[key]))
      .enter()
      .append("td")
      .text(d => d);
  }
  
  // -------------------------------
  // 🔵 2. 시계열 에어리어 차트 with Brush
  // -------------------------------
  
  const timeSeriesData = [
    { date: "2022-01-01", value: 200 },
    { date: "2022-02-01", value: 300 },
    { date: "2022-03-01", value: 250 },
    { date: "2022-04-01", value: 400 },
    { date: "2022-05-01", value: 320 },
    { date: "2022-06-01", value: 500 },
    { date: "2022-07-01", value: 470 },
    { date: "2022-08-01", value: 600 }
  ];
  
  renderAreaChart(timeSeriesData);
  
  function renderAreaChart(rawData) {
    const parseDate = d3.timeParse("%Y-%m-%d");
    const data = rawData.map(d => ({ date: parseDate(d.date), value: +d.value }));
  
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
        if (!event.selection) return;
        const [x0, x1] = event.selection.map(xContext.invert);
        x.domain([x0, x1]);
        focus.select("path").attr("d", area);
        focus.select("g").call(d3.axisBottom(x));
      });
  
    context.append("g")
      .attr("class", "brush")
      .call(brush);
  }