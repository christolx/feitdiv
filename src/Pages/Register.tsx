import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const validateInput = (): boolean => {
        if (!fullName || !email || !password || !phoneNumber || !address) {
            setError('Semua bidang wajib diisi.');
            return false;
        }

        setError(''); 
        return true;
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateInput()) return;

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3000/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName,
                    email,
                    password,
                    phoneNumber,
                    address,
                }),
            });

            if (!response.ok) {
                throw new Error('Pendaftaran gagal. Periksa data Anda dan coba lagi.');
            }

            const data = await response.json();
            console.log('User registered:', data);

            navigate('/login'); 
        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan saat mendaftar.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[url(src/assets/best-movie-tv-show-watchlist-apps-track-seen-featured1.avif)] bg-cover">
            <div className='w-56 bg-[url(src/assets/kids-movies-2020-artemis-fowl-1576601149.avif)] bg-auto md:bg-contain  
            h-96 p-10 rounded-l-3xl shadow-md border-t-8 border-b-8 border-l-1 border-solid border-black'>
                test
            </div>
            <form
                onSubmit={handleRegister}
                className="border-t-8 border-b-8 border-l-1 border-solid border-black  w-80 h-96 px-10 bg-green-800 rounded-r-3xl pt-0 pb-20 shadow-md "
            >
                <h1 className="mt-3 text-2xl font-bold mb-1 justify-self-center">Register</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-3">
                    <label className="block mb-2">Full Name</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-2">Phone Number</label>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className={`w-full py-2 text-white rounded ${
                        isLoading
                            ? 'bg-green-400 cursor-not-allowed'
                            : 'bg-green-400 hover:bg-green-300'
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;