import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { fetchWithToken } from '../utils/api';
const LoginPage: React.FC = () => {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [error, setError] = useState(''); 
    const [isLoading, setIsLoading] = useState(false); 
    const navigate = useNavigate();

    const validateInput = (): boolean => {
        if (!email || !password) {
            setError('Email dan Password harus diisi.');
            return false;
        }

        setError(''); 
        return true;
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateInput()) return; 

        setIsLoading(true); 
        try {
            const response = await fetch('http://localhost:3000/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }), 
            });

            if (!response.ok) {
                throw new Error('Login gagal. Periksa kembali email dan password Anda.');
            }

            const data = await response.json();
   
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            
            const profileResponse = await fetchWithToken('http://localhost:3000/users/profile');
            if (!profileResponse.ok) {
                throw new Error('Gagal mengambil profil pengguna.');
            }
    
            const profileData = await profileResponse.json();
    
            localStorage.setItem('userName', profileData.full_name);

            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan saat login.');
        } finally {
            setIsLoading(false); 
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[url(src/assets/best-movie-tv-show-watchlist-apps-track-seen-featured1.avif)] bg-cover">
            <div></div>
            <form onSubmit={handleLogin} className="border-t-8 border-b-8 border-l-1 border-solid border-black  w-80 h-96 p-10 bg-green-800 rounded-l-3xl shadow-md">
                <h1 className="text-2xl font-bold mb-4 justify-self-center">Login</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>} 
                <div className="mb-4">
                    <label className="block mb-2">Email</label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-64 pr-16 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-64 pr-16 py-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className={`w-80 py-2 text-white rounded ${
                        isLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-400 hover:bg-green-300'
                    }`}
                    disabled={isLoading} 
                >
                    {isLoading ? 'Logging in...' : 'Login'} 
                </button>

                <p className="mt-6 mb-2 text-xl justify-self-center  ">
                    Belum punya akun?{' '}
                </p>

                <button
                    onClick={() => navigate('/register')}
                    className="w-80 py-2 text-white rounded bg-green-400 hover:bg-green-300"
                >
                     Daftar di sini
                </button>
            </form>
            <div className='w-56 bg-[url(src/assets/kids-movies-2020-artemis-fowl-1576601149.avif)] bg-auto md:bg-contain  
            h-96 p-10 rounded-r-3xl shadow-md border-t-8 border-b-8 border-l-1 border-solid border-black'>
                test
            </div>
            
        </div>
    );
};

export default LoginPage;