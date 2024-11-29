// import React, { useState } from 'react';
// import { fetchWithToken } from '../utils/api'; // Fungsi fetch yang sudah Anda buat

// const TransactionPage: React.FC = () => {
//   const [ticketId, setTicketId] = useState<number>(0);
//   const [grossAmount, setGrossAmount] = useState<number>(0);
//   const [bank, setBank] = useState<string>('bca');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const handlePayment = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetchWithToken('http://localhost:3000/transaction/create-transaction', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ticket_id: ticketId, gross_amount: grossAmount, bank: bank }),
//       });
//       const data = await response.json();
//       console.log('Transaction response:', data);
  
//       if (data.transaction?.va_numbers) {
//         // Jika ada VA Number (Bank Transfer)
//         const vaNumbers = data.transaction.va_numbers;
//         const vaNumber = vaNumbers.length > 0 ? vaNumbers[0].va_number : null;
  
//         if (vaNumber) {
//           alert(`Please transfer the payment to VA number: ${vaNumber}`);
//         } else {
//           setError('Bank transfer details not available');
//         }
//       } else if (data.transaction?.token) {
//         // Jika ada Snap token (Misalnya Kartu Kredit atau E-wallet)
//         const snapToken = data.transaction.token;
//         window.snap.pay(snapToken, {
//           onSuccess: function (result: any) {
//             console.log('Payment successful', result);
//             alert('Payment successful!');
//           },
//           onPending: function (result: any) {
//             console.log('Payment pending', result);
//             alert('Payment pending');
//           },
//           onError: function (result: any) {
//             console.log('Payment error', result);
//             alert('Payment error');
//           },
//           onClose: function () {
//             console.log('Payment popup closed');
//             alert('Payment popup closed');
//           },
//         });
//       } else {
//         setError('Transaction failed: No valid response from backend');
//       }
//     } catch (error) {
//       setError('Error processing transaction: ' + (error as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1>Payment Transaction</h1>
//       <input
//         type="number"
//         placeholder="Ticket ID"
//         value={ticketId}
//         onChange={(e) => setTicketId(Number(e.target.value))}
//       />
//       <input
//         type="number"
//         placeholder="Gross Amount"
//         value={grossAmount}
//         onChange={(e) => setGrossAmount(Number(e.target.value))}
//       />
//       <input
//         type="text"
//         placeholder="Bank"
//         value={bank}
//         onChange={(e) => setBank(e.target.value)}
//       />
//       <button onClick={handlePayment} disabled={loading}>
//         {loading ? 'Processing...' : 'Pay Now'}
//       </button>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </div>
//   );
// };

// export default TransactionPage;