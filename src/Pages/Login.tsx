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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
            <form
                onSubmit={handleLogin}
                className="bg-gray-700 w-96 p-8 rounded-lg shadow-lg"
            >
                <h1 className="text-3xl font-bold mb-6 text-center text-green-400">Login</h1>

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-green-400">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-green-400">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full py-2 text-white font-semibold rounded ${
                        isLoading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>

                <p className="mt-6 text-center">
                    <span className="text-gray-700 text-sm ml-20">Belum punya akun? </span>
                    <button
                        onClick={() => navigate('/register')}
                        className="text-green-500 font-semibold hover:underline"
                    >
                        Daftar di sini
                    </button>
                </p>
            </form>
        </div>


    );
};

export default LoginPage;