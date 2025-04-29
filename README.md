# Chocolate Sales Dashboard
[Information Visualization] D3.js Connected Dashboard

This project visualizes chocolate sales data using D3.js and provides an interactive dashboard experience.

## Key Features
- **CSV Data Loading**: Sales data is loaded directly from a CSV file.
- **Responsive Layout**: Charts and tables automatically adjust to different screen sizes.
- **Interactive Area Chart (Time Series)**:
  - Displays sales amount over time.
  - Supports brushing to select a date range and filter the table accordingly.
  - Clicking on a specific date highlights that date and filters the table.
- **Bar Chart (Top Products)**:
  - Shows top-selling products.
  - User can choose Top 5, Top 10, or Top 20 products via a dropdown menu.
  - Clicking a product highlights it, while other bars fade out.
- **Searchable and Scrollable Data Table**:
  - Search bar to filter products dynamically by name.
  - Clicking a table row highlights the corresponding product in the bar chart.
- **Fully Linked Interactions**:
  - Area chart, bar chart, and table are all dynamically connected.
  - Actions in one component update the others automatically.
- **Smooth Visual Effects**:
  - Non-selected bars fade out when a product is selected.
  - Selected dates and products are visually emphasized without disturbing the original color scheme.

## Deployment
- Deployed using GitHub Pages.
- Link: [Chocolate Sales Dashboard](https://ahmeelee.github.io/d3-dashboard/)

---

Developed for the Information Visualization Technologies course.