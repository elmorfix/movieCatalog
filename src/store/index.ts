import { createStore } from "vuex";
import type { State, Movie } from "../types";
import type { Commit } from "vuex/types/index.js";

const apiKey = import.meta.env.VITE_API_KEY;

export default createStore<State>({
  state: {
    movies: [],
    cart: [],
    favorites: [],
    showCart: false,
    showFavorites: false,
    currentPage: "home",
    loading: false,
    searchQuery: "",
    apiKey: apiKey,
  },
  mutations: {
    SET_MOVIES(state:State, movies: Movie[]) {
      state.movies = movies.map((movie) => ({
        ...movie,
        price:
          movie.price || Math.floor(Math.random() * (49.99 - 9.99 + 1)) + 9.99,
      }));
    },
    ADD_TO_CART(state:State, movie: Movie) {
      const itemInCart = state.cart.find((item) => item.id === movie.id);
      if (itemInCart) {
        itemInCart.quantity++;
      } else {
        state.cart.push({ ...movie, quantity: 1 });
      }
    },
    REMOVE_FROM_CART(state:State, movieId: number) {
      state.cart = state.cart.filter((item) => item.id !== movieId);
    },
    CLEAR_CART(state:State) {
      state.cart = [];
    },
    TOGGLE_FAVORITE(state:State, movie: Movie) {
      const index = state.favorites.findIndex((fav) => fav.id === movie.id);
      if (index > -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(movie);
      }
    },
    TOGGLE_CART_VISIBILITY(state:State) {
      if (state.showFavorites) state.showFavorites = false;
      state.showCart = !state.showCart;
    },
    TOGGLE_FAVORITES_VISIBILITY(state:State) {
      if (state.showCart) state.showCart = false;
      state.showFavorites = !state.showFavorites;
    },
    CLOSE_SIDEBARS(state: State) {
      state.showCart = false;
      state.showFavorites = false;
    },
    SET_CURRENT_PAGE(state:State, page: "home" | "checkout") {
      state.currentPage = page;
      window.scrollTo(0, 0);
    },
    SET_LOADING(state:State, isLoading: boolean) {
      state.loading = isLoading;
    },
    SET_SEARCH_QUERY(state:State, query: string) {
      state.searchQuery = query;
    },
  },
  actions: {
    async fetchMovies({ commit, state }: { commit: Commit; state: State }) {
      commit("SET_LOADING", true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${state.apiKey}&language=pt-BR&page=1`
        );
        const data = await response.json();
        commit("SET_MOVIES", data.results || []);
      } catch (error) {
        console.error("Erro ao buscar filmes populares:", error);
      } finally {
        commit("SET_LOADING", false);
      }
    },
    async searchMovies({
      commit,
      state,
      dispatch,
    }: {
      commit: Commit;
      state: State;
      dispatch: Function;
    }) {
      if (!state.searchQuery.trim()) {
        dispatch("fetchMovies");
        return;
      }
      commit("SET_LOADING", true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${state.apiKey}&language=pt-BR&query=${state.searchQuery}&page=1`
        );
        const data = await response.json();
        commit("SET_MOVIES", data.results || []);
      } catch (error) {
        console.error("Erro ao pesquisar filmes:", error);
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
  getters: {
    cartItemCount: (state: State) =>
      state.cart.reduce((count, item) => count + item.quantity, 0),
    cartTotal: (state: State) =>
      state.cart.reduce((total, item) => total + item.price * item.quantity, 0),
    favoriteMovies: (state: State) => state.favorites,
    isFavorite: (state: State) => (movieId: number) =>
      state.favorites.some((movie) => movie.id === movieId),
    favoritesCount: (state: State) => state.favorites.length,
  },
});
