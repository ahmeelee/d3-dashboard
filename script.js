<<<<<<< HEAD
d3.csv("Chocolate-Sales.csv").then(data => {
    renderTable(data);
  });
  
  function renderTable(data) {
    const container = d3.select("#data-table");
    container.html(""); // 초기화
=======
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
>>>>>>> abb1df1 (Add interactive table)
  
    const table = container.append("table");
    const thead = table.append("thead");
    const tbody = table.append("tbody");
  
    const columns = Object.keys(data[0]);
  
<<<<<<< HEAD
    // 헤더
=======
>>>>>>> abb1df1 (Add interactive table)
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
<<<<<<< HEAD
        d3.selectAll("th").attr("data-order", "none"); // 다른 헤더 초기화
=======
        d3.selectAll("th").attr("data-order", "none");
>>>>>>> abb1df1 (Add interactive table)
        d3.select(this).attr("data-order", ascending ? "asc" : "desc");
        data.sort((a, b) => ascending ? d3.ascending(a[d], b[d]) : d3.descending(a[d], b[d]));
        renderTable(data);
      });
  
<<<<<<< HEAD
    // 바디
=======
>>>>>>> abb1df1 (Add interactive table)
    const rows = tbody.selectAll("tr")
      .data(data)
      .enter()
      .append("tr")
      .on("click", function(event, d) {
        d3.selectAll("tr").style("background-color", null);
        d3.select(this).style("background-color", "#e6f7ff");
<<<<<<< HEAD
        console.log("Selected row:", d); // 나중에 state 연결에 활용 가능
=======
        console.log("Selected row:", d);
>>>>>>> abb1df1 (Add interactive table)
      });
  
    rows.selectAll("td")
      .data(d => columns.map(key => d[key]))
      .enter()
      .append("td")
      .text(d => d);
  }