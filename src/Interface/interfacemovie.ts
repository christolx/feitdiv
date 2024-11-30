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
  