import { useEffect, useState } from 'react';
import { fetchWithToken } from '../utils/api';
import { Payment } from '../Interface/interface';

const PaymentHistory = () => {
    const [payments, setPayments] = useState<Payment[]>([]); 
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      const fetchPayments = async () => {
        setLoading(true);
        try {
          const response = await fetchWithToken('http://localhost:3000/payments'); 
          const data = await response.json();
          setPayments(data); 
        } catch (error) {
          console.error('Error fetching payments:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchPayments();
    }, []);
  
    return (
      <div className="payment-history">
        <h2>Riwayat Pembayaran</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID Pembayaran</th>
                <th>ID Tiket</th>
                <th>Metode Pembayaran</th>
                <th>Status Pembayaran</th>
                <th>Jumlah</th>
                <th>Tanggal Pembayaran</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.payment_id}>
                  <td>{payment.payment_id}</td>
                  <td>{payment.ticket_id}</td>
                  <td>{payment.payment_method}</td>
                  <td>{payment.payment_status}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.payment_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };
  
  export default PaymentHistory;