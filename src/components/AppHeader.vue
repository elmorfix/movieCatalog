<template>
    <header class="bg-white shadow-md sticky top-0 z-40">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-20">

                <div class="flex-shrink-0">
                    <h1 class="text-2xl font-bold text-indigo-600 cursor-pointer" @click="goToHome">
                        <i class="fas fa-film mr-2"></i>{{ projectName }}
                    </h1>
                </div>

                <div class="flex-1 max-w-lg mx-8" v-if="currentPage === 'home'">
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                            <i class="fas fa-search text-gray-400"></i>
                        </span>
                        <input :value="searchQuery" @input="onSearchInput(($event.target as HTMLInputElement).value)"
                            class="w-full pl-10 pr-4 py-2 border rounded-full text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Pesquisar filmes...">
                    </div>
                </div>

                <div class="flex items-center space-x-5">
                    <button @click="toggleFavorites" class="relative text-gray-500 hover:text-indigo-600">
                        <div class="">
                            <HeartSvg width="30px" />
                        </div>
                        <span v-if="favoritesCount > 0"
                            class="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{{
                            favoritesCount }}</span>
                    </button>
                    <button @click="toggleCart" class="relative text-gray-500 hover:text-indigo-600">
                        <div class="">
                            <CartSvg width="30px" height="30px" />
                        </div>
                        <span v-if="cartItemCount > 0"
                            class="absolute -top-1 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{{
                            cartItemCount }}</span>
                    </button>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import CartSvg from '../assets/cart.svg?component';
import HeartSvg from '../assets/heart.svg?component';

const store = useStore();
let debounceTimer: number;

const currentPage = computed((): void => store.state.currentPage);
const searchQuery = computed((): void => store.state.searchQuery);
const cartItemCount = computed((): void => store.getters.cartItemCount);
const favoritesCount = computed((): void => store.getters.favoritesCount);
const projectName = import.meta.env.VITE_PROJECT_NAME;

const updateSearchQuery = (query: string) => {
    store.commit('SET_SEARCH_QUERY', query);
};

const onSearchInput = (query: string) => {
    store.commit('SET_SEARCH_QUERY', query);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => { performSearch(); }, 500);
};

const performSearch = ():void => {
    store.dispatch('searchMovies');
};

const goToHome = ():void => {
    store.commit('SET_CURRENT_PAGE', 'home');
    if (searchQuery.value) {
        store.commit('SET_SEARCH_QUERY', '');
        store.dispatch('fetchMovies');
    }
};

const toggleCart = ():void => {
    store.commit('TOGGLE_CART_VISIBILITY');
};

const toggleFavorites = ():void => {
    store.commit('TOGGLE_FAVORITES_VISIBILITY');
};
</script>
  
