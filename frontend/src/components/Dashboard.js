import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [utilisasiData, setUtilisasiData] = useState([50, 60, 70, 65, 75]);
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "items"));
        const itemList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const topItems = itemList
          .filter(item => item.kategori && typeof item.stok === "number")
          .sort((a, b) => b.stok - a.stok)
          .slice(0, 5);

        setItems(topItems);

        const utilisasiSimulasi = topItems.map(item => Math.min(item.stok, 100));
        setUtilisasiData(utilisasiSimulasi.length === 5 ? utilisasiSimulasi : [50, 60, 70, 65, 75]);

        const lowStock = itemList
          .filter(item => typeof item.stok === "number" && item.stok <= 5)
          .sort((a, b) => a.stok - b.stok);
        setLowStockItems(lowStock);

      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const maxStok = Math.max(...items.map(item => item.stok || 0), 1);

  const lineChartDataBarangMasuk = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
    datasets: [
      {
        label: 'Barang Masuk',
        data: [10, 40, 25, 60, 45],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      }
    ]
  };

  const lineChartDataUtilisasi = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
    datasets: [
      {
        label: 'Utilisasi Gudang (%)',
        data: utilisasiData,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      }
    ]
  };

  const lineChartOptions = {
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20 },
      },
      x: {
        display: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="container mt-4" style={{ backgroundColor: "#fcf4cc", minHeight: "100vh", padding: "20px", borderRadius: "12px" }}>
      <div className="row g-4">

        {/* Top 5 Produk Aktif */}
        <div className="col-md-6">
          <div className="card p-4 h-100 shadow border-0" style={{ backgroundColor: "#fffce1" }}>
            <h6 className="fw-bold text-dark mb-3">Top 5 Produk Aktif</h6>
            {items.map((item) => (
              <div key={item.id} className="d-flex align-items-center justify-content-between my-2">
                <span className="text-muted small">{item.kategori}</span>
                <div className="progress flex-grow-1 mx-3" style={{ height: "8px", borderRadius: "20px", backgroundColor: "#fcecb3" }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${(item.stok / maxStok) * 100}%`,
                      background: "linear-gradient(to right, #f59e0b, #fde68a)",
                      borderRadius: "20px"
                    }}
                  ></div>
                </div>
                <span className="badge bg-secondary text-dark fw-semibold">{item.stok}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grafik Barang Masuk */}
        <div className="col-md-6">
          <div className="card p-4 h-100 shadow border-0" style={{ backgroundColor: "#fffce1" }}>
            <h6 className="fw-bold text-dark mb-3">Grafik Barang Masuk</h6>
            <div style={{ height: '140px' }}>
              <Line data={lineChartDataBarangMasuk} options={lineChartOptions} />
            </div>
          </div>
        </div>

        {/* Grafik Utilisasi Gudang */}
        <div className="col-md-6">
          <div className="card p-4 h-100 shadow border-0" style={{ backgroundColor: "#fffce1" }}>
            <h6 className="fw-bold text-dark mb-3">Grafik Utilisasi Gudang</h6>
            <div style={{ height: '140px' }}>
              <Line data={lineChartDataUtilisasi} options={lineChartOptions} />
            </div>
          </div>
        </div>

        {/* Peringatan Stok Menipis */}
        <div className="col-md-6">
          <div className="card p-4 h-100 shadow border-0" style={{ backgroundColor: "#fffce1" }}>
            <h6 className="fw-bold text-dark mb-3">Peringatan Stok Menipis</h6>
            {lowStockItems.length === 0 ? (
              <p className="text-muted">Semua stok aman.</p>
            ) : (
              <ul className="list-group list-group-flush">
                {lowStockItems.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    style={{ borderBottom: "1px solid #dee2e6", backgroundColor: "#fcf4cc" }}
                  >
                    <span className="text-muted">{item.kategori || item.name || "Tidak diketahui"}</span>
                    <span className={`badge rounded-pill ${item.stok <= 5 ? 'bg-danger text-light' : 'bg-warning text-dark'}`}>
                      {item.stok}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>

      <style>{`
        .card {
          transition: all 0.2s ease-in-out;
        }
        .card:hover {
          box-shadow: 0 0 15px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
