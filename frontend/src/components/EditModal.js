import React, { useState } from 'react';

const EditModal = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState(item);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Produk</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
        }}>
          <div className="form-group">
            <label>Nama Produk</label>
            <input name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Kategori</label>
            <input name="category" value={formData.category} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Aktivo">Aktivo</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Batal</button>
            <button type="submit">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
