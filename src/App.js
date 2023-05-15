import React, { useState } from 'react';
import axios from 'axios';
import Chart from "react-apexcharts";
import { saveAs } from 'file-saver';

const App = () => {
  const [histogramData, setHistogramData] = useState(null);
  const [state, setState] = useState({});

  const fetchData = async () => {
    try {
      const response = await axios.get('https://www.terriblytinytales.com/test.txt');
      const content = response.data;
      const words = content.split(/\s+/);
      const frequency = {};
      words.forEach((word) => {
        if (word in frequency) {
          frequency[word] += 1;
        } else {
          frequency[word] = 1;
        }
      });
      const sortedFrequency = Object.entries(frequency).sort((a, b) => b[1] - a[1]);
      const top20Words = sortedFrequency.slice(0, 20);
      const labels = top20Words.map((word) => word[0]);
      const data = top20Words.map((word) => word[1]);
      setHistogramData({ labels, datasets: [{ data }] });

      setState({
        options: {
          chart: {
            id: "basic-bar"
          },
          xaxis: {
            categories: labels
          }
        },
        series: [
          {
            name: "series-1",
            data: data
          }
        ]
      });

    } catch (error) {
      console.error(error);
    }
  };

  const handleExport = () => {
    const csvData = histogramData.labels.reduce((acc, label, index) => {
      const row = `${label},${histogramData.datasets[0].data[index]}\n`;
      return acc + row;
    }, 'Word,Frequency\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'histogram.csv');
  };

  return (
    <div>
      <button onClick={fetchData}>Submit</button>
      {histogramData && (
        <div>
          <Chart
            options={state.options}
            series={state.series}
            type="bar"
            width="500"
          />

          <button onClick={handleExport}>Export</button>
        </div>
      )}
    </div>
  );
};

export default App;
