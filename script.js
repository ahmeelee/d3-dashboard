d3.csv("Chocolate-Sales.csv").then(data => {
    renderTable(data);
  });
  
  function renderTable(data) {
    const container = d3.select("#data-table");
    container.html(""); // 초기화
  
    const table = container.append("table");
    const thead = table.append("thead");
    const tbody = table.append("tbody");
  
    const columns = Object.keys(data[0]);
  
    // 헤더
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
        d3.selectAll("th").attr("data-order", "none"); // 다른 헤더 초기화
        d3.select(this).attr("data-order", ascending ? "asc" : "desc");
        data.sort((a, b) => ascending ? d3.ascending(a[d], b[d]) : d3.descending(a[d], b[d]));
        renderTable(data);
      });
  
    // 바디
    const rows = tbody.selectAll("tr")
      .data(data)
      .enter()
      .append("tr")
      .on("click", function(event, d) {
        d3.selectAll("tr").style("background-color", null);
        d3.select(this).style("background-color", "#e6f7ff");
        console.log("Selected row:", d); // 나중에 state 연결에 활용 가능
      });
  
    rows.selectAll("td")
      .data(d => columns.map(key => d[key]))
      .enter()
      .append("td")
      .text(d => d);
  }