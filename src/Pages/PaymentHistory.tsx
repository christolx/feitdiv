import React, { useState, useEffect } from 'react';
import { fetchWithToken } from '../utils/api';

interface PaymentDetails {
    ticket_id : number;
    order_id: string;
    seat_number: string;
    payment_method: string;
    payment_status: string;
    amount: number;
    payment_date: string;
    va_number: string;
}

const Payments: React.FC = () => {
    const [payments, setPayments] = useState<PaymentDetails[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPayments = async () => {
        try {
            const response = await fetchWithToken('http://localhost:3000/payments/payments', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Gagal mengambil data pembayaran');
            }

            const data = await response.json();
            setPayments(data);
        } catch (error) {
            console.error('Error:', error);
            setError(error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak terduga');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [payments]);

    const refreshPaymentStatus = async (orderId: string): Promise<string | null> => {
        try {
            const response = await fetchWithToken('http://localhost:3000/payments/RefreshStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ order_id: orderId }),
            });

            if (!response.ok) {
                throw new Error('Gagal memperbarui status pembayaran');
            }

            const data = await response.json();
            return data.transaction_status;
        } catch (error) {
            console.error('Error refreshing payment status:', error);
            return null;
        }
    };

    const handleRefreshAll = async () => {
        try {
            setIsLoading(true);

            const promises = payments.map((payment) =>
                refreshPaymentStatus(payment.order_id)
            );

            const updatedStatuses = await Promise.all(promises);

            setPayments((prevPayments) =>
                prevPayments.map((payment, index) => ({
                    ...payment,
                    payment_status: updatedStatuses[index] || payment.payment_status,
                }))
            );
        } catch (error) {
            console.error('Error refreshing all statuses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = async (ticketId: number) => {
        try {
            console.log(ticketId);
            const response = await fetchWithToken(`http://localhost:3000/TicketGroup/delete-group-ticket/${ticketId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Gagal menghapus group ticket');
            }

            setPayments((prevPayments) => prevPayments.filter((payment) => payment.ticket_id !== ticketId));

        } catch (error) {
            console.error('Error canceling ticket:', error);
            setError(error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak terduga');
        }
    };

    const getStatusTextColor = (status: string) => {
        switch (status) {
            case 'settlement':
                return 'text-green-500';
            case 'pending':
                return 'text-orange-500';
            default:
                return 'text-red-500';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-t from-gray-900 to-black py-8">
            <div className="container mx-auto px-6 lg:px-12">
                <h2 className="text-4xl font-bold text-center text-white mb-8">Payment History</h2>

                <div className="flex justify-center mb-6">
                    <button
                        onClick={handleRefreshAll}
                        disabled={isLoading}
                        className="px-8 py-3 bg-green-600 text-white rounded-lg shadow-xl hover:bg-teal-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
                    >
                        {isLoading ? 'Refreshing...' : 'Refresh All Statuses'}
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-center text-gray-400">Loading...</div>
                ) : error ? (
                    <div className="text-center text-red-600">{error}</div>
                ) : (
                    <div className="overflow-x-auto bg-gradient-to-t from-gray-800 to-gray-900 p-6 rounded-lg shadow-xl">
                        <table className="min-w-full table-auto text-white rounded-lg">
                            <thead>
                            <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-left">
                                <th className="px-6 py-3 text-lg font-semibold">Order ID</th>
                                <th className="px-6 py-3 text-lg font-semibold">Seat Number</th>
                                <th className="px-6 py-3 text-lg font-semibold">Payment Method</th>
                                <th className="px-6 py-3 text-lg font-semibold">Status</th>
                                <th className="px-6 py-3 text-lg font-semibold">Amount</th>
                                <th className="px-6 py-3 text-lg font-semibold">VA Number</th>
                                <th className="px-6 py-3 text-lg font-semibold">Payment Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {payments.map((payment) => (
                                <tr
                                    key={payment.order_id}
                                    className="bg-gradient-to-r from-gray-700 to-gray-800 hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700 hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 transform"
                                    style={{ transformOrigin: 'center' }}
                                >
                                    <td className="px-6 py-4 border-b-2 border-gray-600 rounded-l-lg">{payment.order_id}</td>
                                    <td className="px-6 py-4 border-b-2 border-gray-600">{payment.seat_number}</td>
                                    <td className="px-6 py-4 border-b-2 border-gray-600">{payment.payment_method}</td>
                                    <td className={`px-6 py-4 border-b-2 border-gray-600 ${getStatusTextColor(payment.payment_status)}`}>
                                        {payment.payment_status}
                                    </td>
                                    <td className="px-6 py-4 border-b-2 border-gray-600">Rp {payment.amount}</td>
                                    <td className="px-6 py-4 border-b-2 border-gray-600">{payment.va_number}</td>
                                    <td className="px-6 py-4 border-b-2 border-gray-600 rounded-r-lg">
                                        {payment.payment_date
                                            ? new Date(payment.payment_date)
                                                .toISOString()
                                                .replace('T', ' ')
                                                .replace('Z', '')
                                            : '-'}
                                    </td>

                                    <td className="px-6 py-4 border-b-2 border-gray-600">
                                        <button
                                            onClick={() => handleCancel(payment.ticket_id)}
                                            className={`px-4 py-2 rounded-lg shadow-lg transition duration-300 ${
                                                payment.payment_status !== 'settlement'
                                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                            }`}
                                            disabled={payment.payment_status === 'settlement'}
                                        >
                                            {payment.payment_status === 'settlement' ? 'Settled' : 'Cancel'}
                                        </button>
                                    </td>

                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payments;