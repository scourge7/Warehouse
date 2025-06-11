// FormTransaksi.js
import React from 'react';

export default function FormTransaksi() {
  return (
    <div className="container mt-4">
      <h4>Form Transaksi</h4>
      <form>
        <div className="mb-3">
          <label className="form-label">Produk</label>
          <select className="form-select">
            <option>Beras</option>
            <option>Gula</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Jumlah</label>
          <input type="number" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Tipe</label>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="tipe" />
            <label className="form-check-label">Masuk</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="tipe" />
            <label className="form-check-label">Keluar</label>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Tanggal</label>
          <input type="date" className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary">Simpan</button>
      </form>
    </div>
  );
}
