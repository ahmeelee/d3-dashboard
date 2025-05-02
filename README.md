# Chocolate Sales Dashboard  
[Information Visualization] D3.js Connected Dashboard

This dashboard visualizes chocolate sales data using D3.js, offering an interactive and responsive way to explore patterns in sales, products, and time.

## Key Features

- **CSV Data Loading**  
  Loads sales data directly from a CSV file, allowing for simple data updates.

- **Responsive Layout**  
  The dashboard adjusts automatically to different screen sizes and resolutions.

- **Interactive Area Chart (Time Series)**  
  - Visualizes sales trends over time.  
  - Users can brush to select a date range, which filters the table below.  
  - Clicking a specific date highlights it and filters both the table and bar chart.

- **Bar Chart (Top Products)**  
  - Displays top-selling chocolate products.  
  - A dropdown allows users to switch between Top 5, Top 10, and Top 20 views.  
  - Clicking a product highlights it and dims the others for focus.

- **Searchable & Scrollable Data Table**  
  - The table lists all sales records by country, product, date, and amount.  
  - Includes a search bar to filter rows by product name in real-time.  
  - Clicking a row highlights the selected product in the bar chart.

- **Linked Interactions**  
  - The area chart, bar chart, and table are fully connected.  
  - Selections in one view automatically update the others.  
  - Only one filter (date or product) is active at a time for clarity.

- **Smooth Visual Feedback**  
  - Uses opacity to highlight selections without changing original color schemes.  
  - Transitions and interactions are designed to be subtle but responsive.

## Deployment

Deployed using GitHub Pages:  
🔗 [Chocolate Sales Dashboard](https://ahmeelee.github.io/d3-dashboard/)

---

Created as part of the _Information Visualization_ course assignment.