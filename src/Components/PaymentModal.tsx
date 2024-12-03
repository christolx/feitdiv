import React, {useState, useEffect} from 'react';
import {fetchWithToken} from '../utils/api';
import {useNavigate} from 'react-router-dom';

interface PaymentModalProps {
    vaNumber: string;
    orderId: string;
    onClose: () => void;
    isOpen: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({vaNumber, orderId, onClose, isOpen}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<string | null>(null);
    const [transactionStatus, setTransactionStatus] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && orderId) {
            checkPaymentStatus(orderId);
        }
    }, [isOpen, orderId]);

    const checkPaymentStatus = async (orderId: string) => {
        if (isLoading) return;
        setIsLoading(true);
        setIsError(null);
        try {
            console.log(`Memulai permintaan untuk memeriksa status pembayaran dengan orderId: ${orderId}`);

            const response = await fetchWithToken('http://localhost:3000/payments/check-payment-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({order_id: orderId}),
            });


            console.log('Status Response:', response.status);
            if (response.ok) {
                const data = await response.json();
                setTransactionStatus(data.transaction_status);
                console.log('Response Body:', data);

                setTransactionStatus(data.transaction_status);
            } else {
                console.error(`API Error: ${response.status} ${response.statusText}`);
            }
        } catch (error) {

            console.error('Terjadi error:', error);

            if (error instanceof Error) {
                setIsError(error.message);
            } else {
                setIsError('Terjadi kesalahan yang tidak terduga');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const handleClose = () => {
        navigate('/paymenthistory');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div
                className="bg-gradient-to-b from-gray-500 to-black p-8 rounded-lg shadow-2xl w-11/12 max-w-lg text-black animate__animated animate__fadeIn animate__faster">
                {/* Header Section */}
                <h2 className="text-2xl font-semibold text-center text-gray-800">
                    Id : {orderId}
                </h2>

                {/* Body Section */}
                <p className="text-lg text-center text-gray-300 mt-4">
                    To complete your payment, please transfer the amount to the following Virtual Account (VA) number:
                </p>

                <div className="text-center mt-6">
                    <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 mb-6">
                        <p className="text-2xl font-semibold text-gray-600">{vaNumber}</p>
                        <p className="text-sm text-gray-500">Use this number for your bank transfer.</p>
                    </div>

                    {/* Payment Status */}
                    {isLoading ? (
                        <p className="text-center text-white">Loading payment status...</p>
                    ) : isError ? (
                        <p className="text-center text-red-500">Error: {isError}</p>
                    ) : (
                        <p className="text-center text-white"></p>
                    )}

                    {/* Button Section */}
                    <button
                        onClick={handleClose}
                        className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;