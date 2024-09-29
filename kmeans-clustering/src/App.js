import React, { useState, useEffect } from 'react';
import axios from 'axios';
import KMeansControl from './KMeansControl';
import KMeansPlot from './KMeansPlot';
import './App_.css';
import './App.css';


function App() {
  const [data, setData] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [idx, setIdx] = useState(-1);
  const [method, setMethod] = useState('random');
  const [manualCentroids, setManualCentroids] = useState([]);

  const generateNewDataset = async () => {
    try {
      const res = await axios.get('http://localhost:5000/generate_data');
      setData(res.data);
      setSnapshots([]);
      setIdx(-1);
      setManualCentroids([]);
    } catch (err) {
      console.error(err);
    }
  };

  const init = async (k, method, manualCentroids) => {
    try {
      const res_ = await axios.post('http://localhost:5000/kmeans', {
        k: k,
        method: method,
        centroids: method === 'manual' ? manualCentroids : [],
        data: data, // Use existing data
      });
      setSnapshots(res_.data.snapshots);
      setIdx(0);
    } catch (err) {
      console.error(err);
    }
  };

  const nextSnapshot = () => {
    if (snapshots.length > 0 && idx < snapshots.length - 1) {
      setIdx(idx + 1);
    } else if (idx === snapshots.length - 1) {
      alert('KMeans algorithm has reached convergence!');
    }
  };

  const convergenceSnapshot = async () => {
    if (snapshots.length > 0 && idx < snapshots.length - 1) {
      setIdx(snapshots.length - 1);
    }
  };

  const resetAlgorithm = () => {
    setSnapshots([]);
    setIdx(-1);
    setManualCentroids([]);
  };

  const handleCoordinateClick = (coord) => {
    if (method === 'manual') {
      setManualCentroids((prevCentroids) => [...prevCentroids, coord]);
    }
  };

  const isEmpty = () => {
    return snapshots.length === 0;
  };

  useEffect(() => {
    // Generate dataset when the app loads
    generateNewDataset();
  }, []);

  // Do not generate new data when the method changes
  useEffect(() => {
    // Only reset manual centroids when method changes
    setManualCentroids([]);
  }, [method]);

  return (
    <div className="App">
      <h1>KMeans Clustering Algorithm</h1>
      <KMeansControl
        init={init}
        isEmpty={isEmpty}
        setMethod={setMethod}
        generateNewDataset={generateNewDataset}
        nextSnapshot={nextSnapshot}
        convergenceSnapshot={convergenceSnapshot}
        resetAlgorithm={resetAlgorithm}
        method={method}
        snapshots={snapshots}
        idx={idx}
        data={data}
        manualCentroids={manualCentroids}
      />
      {data.length > 0 ? (
        <KMeansPlot
          data={data}
          clusterAssignments={
            idx >= 0 && snapshots.length > 0
              ? snapshots[idx][0]
              : Array(data.length).fill(null)
          }
          centroids={
            idx >= 0 && snapshots.length > 0 ? snapshots[idx][1] : manualCentroids
          }
          onClickCoordinate={handleCoordinateClick}
          isManualMethod={method === 'manual'}
        />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default App;