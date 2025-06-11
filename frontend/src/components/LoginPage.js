import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import bcrypt from 'bcryptjs';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import bgImage from '../assets/bg.jpg';
import ilustrasiBaju from '../assets/baju.png'; // Ganti sesuai nama file ilustrasi bajumu

const MySwal = withReactContent(Swal);

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      MySwal.fire({ icon: 'warning', title: 'Mohon isi semua bidang!' });
      return;
    }

    try {
      const userRef = doc(db, 'users', username);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const validPass = bcrypt.compareSync(password, userData.password);

        if (validPass) {
          await MySwal.fire({ icon: 'success', title: 'Login berhasil!', timer: 1500, showConfirmButton: false });
          localStorage.setItem('username', username);
          onLogin(userData.role);
        } else {
          MySwal.fire({ icon: 'error', title: 'Password salah!' });
        }
      } else {
        MySwal.fire({ icon: 'error', title: 'Pengguna tidak ditemukan!' });
      }
    } catch (error) {
      console.error('Error login:', error);
      MySwal.fire({ icon: 'error', title: 'Terjadi kesalahan saat login', text: error.message });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!regUsername || !regPassword) {
      MySwal.fire({ icon: 'warning', title: 'Mohon isi semua bidang!' });
      return;
    }

    try {
      const userRef = doc(db, 'users', regUsername);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        MySwal.fire({ icon: 'error', title: 'Username sudah digunakan!' });
        return;
      }

      const hashedPassword = bcrypt.hashSync(regPassword, 10);

      await setDoc(userRef, {
        username: regUsername,
        password: hashedPassword,
        role: 'user',
        email: '',
        createdAt: serverTimestamp(),
      });

      await MySwal.fire({
        icon: 'success',
        title: 'Akun berhasil dibuat!',
        text: 'Silakan login.',
        timer: 1500,
        showConfirmButton: false,
      });

      setShowRegister(false);
      setRegUsername('');
      setRegPassword('');
    } catch (error) {
      console.error('Gagal registrasi:', error);
      MySwal.fire({ icon: 'error', title: 'Gagal membuat akun', text: error.message });
    }
  };

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backdropFilter: 'blur(5px)',
      }}
    >
      <div className="container p-0" style={{ maxWidth: '900px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        <div className="row no-gutters">
          {/* Kiri - Ilustrasi */}
       <div
  className="col-md-6"
  style={{
    backgroundImage: `url(${ilustrasiBaju})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '500px',
  }}
></div>

          {/* Kanan - Form Login / Register */}
          <div className="col-md-6" style={{ background: '#64604d', color: '#fff', padding: '40px' }}>
            {!showRegister ? (
              <>
                <h3 className="text-center mb-4">Masuk</h3>
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">Nama Pengguna</label>
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Masukkan nama pengguna"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Kata Sandi</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-warning w-100 rounded-pill mb-2 text-dark fw-bold">Masuk</button>
                  <button type="button" onClick={() => onLogin('guest')} className="btn btn-light w-100 rounded-pill mb-2">Masuk sebagai Tamu</button>
                  <p className="text-center mt-3">
                    Belum punya akun?{' '}
                    <span className="text-warning" role="button" onClick={() => setShowRegister(true)} style={{ cursor: 'pointer' }}>
                      Daftar
                    </span>
                  </p>
                </form>
              </>
            ) : (
              <>
                <h3 className="text-center mb-4">Buat Akun</h3>
                <form onSubmit={handleRegister}>
                  <div className="mb-3">
                    <label className="form-label">Nama Pengguna</label>
                    <input
                      type="text"
                      className="form-control"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="Username baru"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Kata Sandi</label>
                    <input
                      type="password"
                      className="form-control"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Kata sandi"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success w-100 rounded-pill mb-2">Daftar</button>
                  <p className="text-center mt-3">
                    Sudah punya akun?{' '}
                    <span className="text-warning" role="button" onClick={() => setShowRegister(false)} style={{ cursor: 'pointer' }}>
                      Login
                    </span>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
