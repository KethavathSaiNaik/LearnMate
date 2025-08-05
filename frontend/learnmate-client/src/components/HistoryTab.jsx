import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function HistoryTab({ token }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/files/quiz-history', {
          headers: { Authorization: token },
        });

        // ✅ Reverse to place latest score last (right side of chart)
        setData(res.data.reverse());
      } catch {
        setData([]);
      }
    };
    fetchHistory();
  }, [token]);

  const chartData = {
    labels: data.map((d) => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Score (%)',
        data: data.map((d) => (d.score / d.total) * 100),
        fill: false,
        borderColor: 'blue',
        pointBackgroundColor: 'blue',
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.2,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          callback: (value) => `${value}%`,
        },
        title: {
          display: true,
          text: 'Score (%)',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {data.length > 0 ? (
        <div style={{ width: '60vw', height: '60vh' }}>
          <Line data={chartData} options={options} />
        </div>
      ) : (
        <p>📭 No quiz history found.</p>
      )}
    </div>
  );
}

export default HistoryTab;
