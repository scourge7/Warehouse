import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEllipsisV } from 'react-icons/fa';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Inventory = ({ role }) => {
  const [inventoryData, setInventoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    namaProduk: '',
    kategori: '',
    satuan: '',
    tanggalKedaluwarsa: '',
    lokasi: '',
    stok: '',
  });
  const [editId, setEditId] = useState(null);
  const [dropdownId, setDropdownId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const Session = localStorage.getItem('username');

  const formatRupiah = (amount) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(inventoryData);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = inventoryData.filter((item) =>
        item.namaProduk.toLowerCase().includes(lowerSearch)
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, inventoryData]);

  const fetchInventory = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'items'));
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInventoryData(items);
      setFilteredData(items);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    if (!formData.namaProduk) return alert('Nama Produk wajib diisi');
    try {
      const newItem = {
        ...formData,
        stok: Number(formData.stok) || 0,
      };
      const docRef = await addDoc(collection(db, 'items'), newItem);
      const updatedInventory = [...inventoryData, { id: docRef.id, ...newItem }];
      setInventoryData(updatedInventory);
      setFilteredData(updatedInventory);
      resetForm();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item.id);
    setShowForm(true);
    setDropdownId(null);
  };

  const handleUpdate = async () => {
    if (!editId) return;
    try {
      const docRef = doc(db, 'items', editId);
      await updateDoc(docRef, {
        ...formData,
        stok: Number(formData.stok) || 0,
      });
      const updatedInventory = inventoryData.map((item) =>
        item.id === editId ? { ...formData, id: editId } : item
      );
      setInventoryData(updatedInventory);
      setFilteredData(updatedInventory);
      resetForm();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'items', id));
      const updatedInventory = inventoryData.filter((item) => item.id !== id);
      setInventoryData(updatedInventory);
      setFilteredData(updatedInventory);
      setDropdownId(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleCancel = () => resetForm();

  const resetForm = () => {
    setFormData({
      namaProduk: '',
      kategori: '',
      satuan: '',
      tanggalKedaluwarsa: '',
      lokasi: '',
      stok: '',
    });
    setEditId(null);
    setShowForm(false);
  };

  return (
    <div
      className="container py-4"
      style={{ backgroundColor: '#fef8f5', minHeight: '100vh', fontFamily: 'Comic Sans MS, cursive' }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 style={{ color: '#ff6b6b' }}>✨ Inventaris ✨</h4>
        <div className="input-group w-50">
          <span className="input-group-text bg-warning-subtle">
            <FaSearch />
          </span>
          <input
            className="form-control"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {showForm && (
        <div className="card border-warning shadow-sm mb-4 p-3" style={{ borderRadius: '20px' }}>
          <h5 className="text-warning fw-bold">✨ {editId ? 'Edit Produk' : 'Tambah Produk Baru'} ✨</h5>
          <div className="row">
            {['namaProduk', 'satuan', 'lokasi', 'stok'].map((field, i) => (
              <div className="col-md-3 mb-3" key={i}>
                <label className="form-label text-capitalize text-secondary">
                  {field.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type="text"
                  name={field}
                  className="form-control rounded-pill"
                  value={formData[field]}
                  onChange={handleChange}
                />
              </div>
            ))}
            <div className="col-md-3 mb-3">
              <label className="form-label text-secondary">Tanggal Kadaluarsa</label>
              <input
                type="date"
                name="tanggalKedaluwarsa"
                className="form-control rounded-pill"
                value={formData.tanggalKedaluwarsa}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label text-secondary">Kategori</label>
              <select
                className="form-control rounded-pill"
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
              >
                <option value="">Pilih Kategori</option>
                <option value="pakaian">Pakaian</option>
                <option value="celana">Celana</option>
              </select>
            </div>
          </div>
          <button
            className="btn btn-success me-2 rounded-pill px-4"
            onClick={editId ? handleUpdate : handleAdd}
          >
            {editId ? 'Simpan Perubahan' : 'Simpan'}
          </button>
          <button className="btn btn-outline-secondary rounded-pill" onClick={handleCancel}>
            Batal
          </button>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover bg-white shadow rounded">
          <thead className="table-warning text-center">
            <tr>
              <th>Nama Produk</th>
              <th>Kategori</th>
              <th>Satuan</th>
              <th>Kedaluwarsa</th>
              <th>Lokasi</th>
              <th>Stok</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id} className="text-center">
                  <td>{item.namaProduk}</td>
                  <td>{item.kategori}</td>
                  <td>{formatRupiah(item.satuan)}</td>
                  <td>{item.tanggalKedaluwarsa}</td>
                  <td>{item.lokasi}</td>
                  <td>{item.stok}</td>
                  <td>
                    <div className="dropdown">
                      <button
                        className="btn btn-light btn-sm rounded-circle"
                        onClick={() =>
                          setDropdownId(dropdownId === item.id ? null : item.id)
                        }
                      >
                        <FaEllipsisV />
                      </button>
                      {dropdownId === item.id && (
                        <div className="dropdown-menu show p-2 rounded shadow-sm" style={{ position: 'absolute' }}>
                          <button
                            className="dropdown-item text-primary"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {Session && (
        <button
          className="btn btn-warning rounded-circle shadow-lg"
          style={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            width: 60,
            height: 60,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '1.5rem',
            zIndex: 1000,
          }}
          onClick={() => setShowForm(!showForm)}
          title={showForm ? 'Tutup Form' : 'Tambah Produk'}
        >
          <FaPlus />
        </button>
      )}
    </div>
  );
};

export default Inventory;