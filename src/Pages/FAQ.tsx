import React, { useState } from 'react';

const FAQPage: React.FC = () => {
    const faqs = [
        {
            id: 1,
            question: "How do I book movie tickets?",
            answer: "You can book tickets by selecting your preferred movie, theater, and showtime. Login to your account to complete the booking process and choose your seats."
        },
        {
            id: 2,
            question: "Can I cancel my booking?",
            answer: "You can cancel by pressing cancel button before proceeding to pay now. If you try to cancel booking after the process, you can't cancel"
        },
        {
            id: 3,
            question: "What payment methods are accepted?",
            answer: "We accepted MidTrans as our payment method"
        },
        {
            id: 4,
            question: "How do I get my tickets?",
            answer: "After successful payment via MidTrans, you can see your tickets on MyTicket page"
        }
    ];

    const [openId, setOpenId] = useState<number | null>(null);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black text-white">
            <main className="flex-grow container mx-auto px-4 pt-24">
                <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent text-center">
                    Frequently Asked Questions
                </h1>

                <div className="max-w-3xl mx-auto">
                    {faqs.map((faq) => (
                        <div key={faq.id} className="mb-4">
                            <button
                                className="w-full text-left px-6 py-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">{faq.question}</span>
                                    <svg
                                        className={`w-6 h-6 transform transition-transform ${openId === faq.id ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </div>
                                {openId === faq.id && (
                                    <p className="mt-4 text-gray-400">{faq.answer}</p>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </main>

           
        </div>
    );
};

export default FAQPage;