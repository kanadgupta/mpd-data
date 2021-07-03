import { useEffect } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip } from 'chart.js';

import dataset from '../data/processed/groupedByDate/chart.json';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip);

export default function Graph() {
  useEffect(() => {
    const data = {
      labels: dataset.labels,
      datasets: [
        {
          label: 'Use of Force Incidents',
          data: dataset.values,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1,
        },
      ],
    };

    const config = {
      type: 'bar',
      data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
    // eslint-disable-next-line no-new
    new Chart(document.getElementById('myChart'), config);
  }, []);

  return (
    <div>
      <canvas id="myChart"></canvas>
    </div>
  );
}
