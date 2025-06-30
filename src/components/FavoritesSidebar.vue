<template>
    <aside
        :class="['sidebar', 'fixed', 'top-0', 'right-0', 'w-full', 'sm:w-96', 'h-full', 'bg-white', 'shadow-2xl', 'z-50', 'flex', 'flex-col', showFavorites ? 'sidebar-open' : 'sidebar-closed']">
        <div class="flex justify-between items-center mb-6 p-6 bg-rose-400">
            <div class="text-2xl font-bold text-white">
                Meus Favoritos
            </div>
            <button @click="toggleFavorites" class="rounded-md cursor-pointer hover:bg-slate-100 text-black/40 text-lg px-4 pb-1 font-bold">
                x
            </button>
        </div>
        <div v-if="favoriteMovies.length === 0"
            class="flex-grow flex items-center justify-center text-center text-gray-500">
            <p>A sua lista de favoritos está vazia.</p>
        </div>
        <div v-else class="flex-grow overflow-y-auto -mr-6 pr-6 px-6">
            <div v-for="movie in favoriteMovies" :key="movie.id"
                class="flex items-center mb-4 border-dashed border-indigo-100/50 border-b-2 pb-4">
                <img :src="getImageUrl(movie.poster_path)" @error="onImageError"
                    class="w-16 h-24 object-cover rounded-md mr-4" alt="Poster do Filme">
                <div class="flex-grow">
                    <h4 class="font-bold text-sm">{{ movie.title }}</h4>
                    <p class="text-indigo-600 font-semibold text-sm">R$ {{ movie.price.toFixed(2) }}</p>
                </div>
                <div class="flex items-center space-x-3">
                    <button @click="addToCart(movie)" class="text-gray-500 hover:text-indigo-600"
                        title="Adicionar ao carrinho">
                        <div class="hover:cursor-pointer hover:bg-indigo-200 rounded-xl px-2">
                            <CartSvg width="24px" height="24px" />
                        </div>
                    </button>
                    <button @click="toggleFavorite(movie)" class="text-red-500 hover:text-red-700"
                        title="Remover dos favoritos">
                        <div
                            class="hover:cursor-pointer hover:bg-red-200 rounded-xl px-2 transition-colors duration-300">
                            <CloseIcon width="24px" height="24px" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import type { Movie } from '../types';
import CloseIcon from '../assets/close.svg?component';
import CartSvg from '../assets/cart.svg?component';

const store = useStore();

const showFavorites = computed(() => store.state.showFavorites);
const favoriteMovies = computed(() => store.getters.favoriteMovies);

const toggleFavorites = () => store.commit('TOGGLE_FAVORITES_VISIBILITY');
const addToCart = (movie: Movie) => store.commit('ADD_TO_CART', movie);
const toggleFavorite = (id: number) => store.commit('TOGGLE_FAVORITE', id);

const getImageUrl = (path: string | null) => path ? `https://image.tmdb.org/t/p/w200${path}` : 'https://placehold.co/64x96/e2e8f0/cbd5e1?text=N/A';
const onImageError = (event: Event) => {
    const target = event.target as HTMLImageElement;
    if (target) {
        target.src = 'https://placehold.co/64x96/e2e8f0/cbd5e1?text=N/A';
    }
};
</script>

<style scoped>
.sidebar {
    transition: transform 0.5s ease-in-out;
}

.sidebar-open {
    transform: translateX(0);
}

.sidebar-closed {
    transform: translateX(100%);
}
</style>
  
