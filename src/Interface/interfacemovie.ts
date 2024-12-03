export interface Movie {
    movie_id: number;
    movie_name: string;
    age_rating: string;
    duration: number;
    dimension: string;
    language: string;
    release_date: string;
    poster_link: string;
    status: string;
  }
  export interface Showtime {
    showtime_id: number;
    movie_id: number;
    theater_id: number;
    showtime: string; 
    available_seats: number;
    theater_name: string;
    movie_name: string;
  }
  export interface Theater {
    theater_id: number;
    theater_name: string;
    location: string;
    total_seats: number;
  }

  export interface Showtime {
    showtime_id: number;
    movie_id: number;
    theater_id: number;
    showtime: string;
    available_seats: number;
    theater_name: string;
    movie_name: string;
  }
  
  export interface SeatReservation {
    showtime_id: number;
    seat_number: string;
    user_id: number;
    reservation_status: 'Reserved' | 'Available';
  }

  export interface PaymentDetails {
    order_id: string;
    seat_number: string;
    payment_method: string;
    payment_status: string;
    amount: number;
    payment_date: string;
    va_number: string;
}

export interface Ticket {
  ticket_id: number;
  movie_name: string;
  poster_link: string;
  theater_name: string;
  showtime: string;
  seat_number: string;
  ticket_price: number;
}

  