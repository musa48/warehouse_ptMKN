import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useUser } from '../contexts/UserContext';
import image_background from '../assets/bg_login.jpg';
import { EyeSlashIcon, EyeIcon } from '@heroicons/react/20/solid'; 

function Login() {
  const [username, setUsername] = useState('');
  const [pass_user, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); 
  const { login } = useUser ();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth', { username, pass_user });
      login(res.data.JWTtoken, res.data.user);
      navigate('/transaksi');
    } catch (err) {
      alert(err.response?.data?.error || 'Login tidak berhasil');
    }
  };
  const togglePassword = () => {
      setIsPasswordVisible(prev => !prev);
  };
  return (
    <div className="grid grid-cols-3 h-screen w-full">
      <div className="col-span-2 bg-white flex flex-col items-center justify-center">
        <h2 className="text-[5rem] font-bold text-blue-500">Welcome</h2>
        <h3 className="text-xl mb-10">Warehous Mitra Kreasi Natural</h3>
        <form onSubmit={handleSubmit} className="flex flex-col w-fitt">
          <div>
            <label className="ms-2 text-xl">Username</label>
            <div className="mt-2">
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="focus:bg-gray-100 p-4 block w-96 border-2 border-blue-200 rounded-lg placeholder:text-gray-400 focus:border-2 focus:-outline-offset-2 focus:outline-indigo-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600" placeholder="user123" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mt-6 pe-2">
              <label className="ms-2 text-xl">Password</label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">Forgot password?</a>
              </div>
            </div>
            <div className="mt-2 relative">
              <input type={isPasswordVisible ? "text" : "password"} value={pass_user} onChange={(e) => setPassword(e.target.value)} required className="focus:bg-gray-100 p-4 block w-96 border-2 border-blue-200 rounded-lg placeholder:text-gray-400 focus:border-2 focus:-outline-offset-2 focus:outline-indigo-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600 pr-12" placeholder="*************"/>
              <button type="button" onClick={togglePassword} className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-indigo-500 transition" aria-label={isPasswordVisible ? "Hide password" : "Show password"}>
                {isPasswordVisible ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 15.788 7.03 19 12 19c1.837 0 3.553-.433 5.02-1.223M3.98 8.223L2.25 6.5M3.98 8.223L2.25 6.5M20.02 15.777L21.75 17.5M20.02 15.777A10.477 10.477 0 0022.066 12C20.774 8.212 16.97 5 12 5a10.477 10.477 0 00-5.02 1.223M20.02 15.777L2.25 6.5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12c1.5-4.5 6-7.5 9.75-7.5S20.25 7.5 21.75 12c-1.5 4.5-6 7.5-9.75 7.5S3.75 16.5 2.25 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="mt-6 flex flex-row bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 text-center items-center text-xl font-semibold gap-2 rounded-xl">
              Login
              <svg className="shrink-0 size-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 26 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-gray-400">
          Belum punya akun ?
          <a href="#" className="ms-2 font-semibold text-indigo-400 hover:text-indigo-200">Registrasi disini</a>
        </p>
        <span>Untuk fungsi register bisa dijalankan langsung melalui endpoint yang sudah disertakan pada readme. file</span>
      </div>
      <div>
        <img src={image_background} className="h-screen object-cover"/>
      </div>
    </div>
  );
}
export default Login;
