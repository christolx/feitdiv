import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

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
                headers: {'Content-Type': 'application/json'},
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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
            <form
                onSubmit={handleRegister}
                className="bg-gray-700 w-96 p-8 rounded-lg shadow-lg mt-10"
            >
                <h1 className="text-3xl font-bold mb-6 text-center text-green-400">
                    Register
                </h1>

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-green-400">Full Name</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                    />
                </div>

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

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-green-400">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-green-400">Phone Number</label>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-green-400">Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
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
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>

    );
};

export default RegisterPage;