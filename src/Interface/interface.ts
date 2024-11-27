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