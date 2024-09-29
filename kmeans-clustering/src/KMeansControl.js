import React, { useState } from 'react';
import './KMeansControl.css';

function KMeansControl({
  init,
  isEmpty,
  setMethod,
  generateNewDataset,
  nextSnapshot,
  convergenceSnapshot,
  resetAlgorithm,
  method,
  snapshots,
  idx,
  data,
  manualCentroids,
}) {
  const [k, setK] = useState(3);

  const netStep = async () => {
    if (snapshots.length === 0) {
      if (method === 'manual' && manualCentroids.length < k) {
        alert(`Please select ${k} centroids on the plot.`);
        return;
      }
      await init(k, method, manualCentroids);
    } else {
      nextSnapshot();
    }
  };

  const runToConvergence = async () => {
    if (snapshots.length > 0 && idx < snapshots.length - 1) {
      convergenceSnapshot();
    } else if (snapshots.length === 0) {
      if (method === 'manual' && manualCentroids.length < k) {
        alert(`Please select ${k} centroids on the plot.`);
        return;
      }
      await init(k, method, manualCentroids);
      convergenceSnapshot();
    }
  };

  const handleMethodChange = (e) => {
    setMethod(e.target.value);
    resetAlgorithm();
  };

  return (
    <div className="control-panel">
      <div className="form-group">
        <label htmlFor="k-input">Number of Clusters (k):</label>
        <input
          id="k-input"
          type="number"
          value={k}
          onChange={(e) => setK(Number(e.target.value))}
          min="1"
        />
      </div>
      <div className="form-group">
        <label htmlFor="method-select">Initialization Method:</label>
        <select
          id="method-select"
          value={method}
          onChange={handleMethodChange}
        >
          <option value="random">Random</option>
          <option value="manual">Manual</option>
          <option value="kmeans++">Kmeans++</option>
          <option value="farthest_first">Farthest First</option>
        </select>
      </div>
      {method === 'manual' && (
        <p className="centroid-counter">
          Selected Centroids: {manualCentroids.length} / {k}
        </p>
      )}
      <div className="button-group">
        <button onClick={netStep}>Next Step</button>
        <button onClick={runToConvergence}>Run to Convergence</button>
        <button onClick={generateNewDataset}>Generate Dataset</button>
        <button onClick={resetAlgorithm}>Reset</button>
      </div>
    </div>
  );
}

export default KMeansControl;
