export interface Region {
    name : string;
}

export interface ProtectedRouteProps {
    children: JSX.Element; 
}

export interface Movie {
    id: number;
    title: string;
    rating: string;
    poster_path: string;
    release_date: string;
}

export interface Ticket {
    ticket_id: number;
    movie_name: string;
    theater_name: string;
    showtime: string;
    seat_number: string;
    ticket_price: number;
    status: 'Completed' | 'Cancelled' | 'Booked';
}

export interface Payment {
    payment_id: number;
    ticket_id: number;
    payment_method: string;
    payment_status: string;
    amount: number;
    payment_date: string;
}