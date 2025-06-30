export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  price: number;
}

export interface CartItem extends Movie {
  quantity: number;
}

export interface State {
  movies: Movie[];
  cart: CartItem[];
  favorites: Movie[];
  showCart: boolean;
  showFavorites: boolean;
  currentPage: "home" | "checkout";
  loading: boolean;
  searchQuery: string;
  apiKey: string;
}
