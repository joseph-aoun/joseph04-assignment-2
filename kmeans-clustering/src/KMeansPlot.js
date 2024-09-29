import React from 'react';
import Plot from 'react-plotly.js';
import './KMeansPlot.css';

function KMeansPlot({
  data,
  centroids,
  clusterAssignments,
  onClickCoordinate,
  isManualMethod,
}) {
  const colors = [
    'blue', 'green', 'red', 'purple', 'orange', 'brown', 'pink', 'gray', 'olive', 'cyan',
    'darkblue', 'darkgreen', 'darkred', 'darkpurple', 'darkorange', 'darkbrown', 'darkpink', 'darkgray', 'darkolive', 'darkcyan',
  ];

  const plotData = [];

  // Group data points by cluster assignments
  const clusters = {};
  for (let i = 0; i < data.length; i++) {
    const clusterIdx = clusterAssignments ? clusterAssignments[i] : null;
    const color =
      clusterIdx !== null && clusterIdx >= 0
        ? colors[clusterIdx % colors.length]
        : 'lightgray';
    if (!clusters[color]) {
      clusters[color] = { x: [], y: [] };
    }
    clusters[color].x.push(data[i][0]);
    clusters[color].y.push(data[i][1]);
  }

  // Add each cluster to plotData
  for (const [color, points] of Object.entries(clusters)) {
    plotData.push({
      x: points.x,
      y: points.y,
      mode: 'markers',
      type: 'scatter',
      name: `Cluster`,
      marker: { color: color, size: 8 },
    });
  }

  // Add centroids to plotData
  if (centroids && centroids.length > 0) {
    plotData.push({
      x: centroids.map((c) => c[0]),
      y: centroids.map((c) => c[1]),
      mode: 'markers',
      type: 'scatter',
      name: 'Centroids',
      marker: { color: 'black', size: 12, symbol: 'x' },
    });
  }

  const handleClick = (event) => {
    if (isManualMethod && event.points.length > 0) {
      const { x, y } = event.points[0];
      onClickCoordinate([x, y]); // Send the clicked coordinates back to parent
    }
  };

  return (
    <Plot
      data={plotData}
      layout={{
        title: 'KMeans Clustering Data',
        width: 700,
        height: 500,
        clickmode: 'event',
      }}
      onClick={handleClick}
    />
  );
}

export default KMeansPlot;