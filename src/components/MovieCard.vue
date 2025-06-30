<template>
    <div
        class="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
        <div class="relative">
            <img :src="imageUrl" @error="onImageError" class="w-full h-auto object-cover" style="aspect-ratio: 2/3;"
                alt="Poster do Filme">
            <button @click="toggleFavorite"
                :class="['absolute', 'top-3', 'right-3', 'w-10', 'h-10', 'rounded-full', 'flex', 'items-center', 'justify-center', 'bg-opacity-50', 'hover:bg-opacity-75', isFavorite ? 'bg-red-700 animate-[bounce_1s_ease-in_2]' : 'bg-white']">
                <div>
                    <HeartSvg width="30px" />
                </div>
            </button>
        </div>
        <div class="p-4 flex flex-col flex-grow">
            <p class="text-xs text-gray-500 mb-1">{{ releaseDate }}</p>
            <h3 class="text-lg font-bold text-gray-800 truncate">{{ movie.title }}</h3>
            <div class="flex items-center text-sm text-gray-600 my-2">
                <i class="fas fa-star text-yellow-400 mr-1"></i>
                <span>{{ movie.vote_average.toFixed(1) }}</span>
            </div>
            <p class="text-xl font-extrabold text-indigo-600 mb-4 mt-auto">R$ {{ movie.price.toFixed(2) }}</p>
            <button @click="addToCart"
                class="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
                <i class="fas fa-cart-plus mr-2"></i>Adicionar
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { useStore } from 'vuex';
import type { Movie } from '../types';
import HeartSvg from '../assets/heart.svg?component';

const props = defineProps<{ movie: Movie }>();
const store = useStore();
const imageUrl = computed(():void => props.movie.poster_path ? `https://image.tmdb.org/t/p/w500${props.movie.poster_path}` : 'https://placehold.co/500x750/e2e8f0/cbd5e1?text=N/A');

const releaseDate = computed(():void => {
    if (!props.movie.release_date) return 'Data não informada';
    return new Date(props.movie.release_date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
});

const isFavorite = computed(():void => store.getters.isFavorite(props.movie.id));

const addToCart = (): void => {
    store.commit('ADD_TO_CART', props.movie);
};

const toggleFavorite = ():void => {
    store.commit('TOGGLE_FAVORITE', props.movie);
};

const onImageError = (event: Event): void => {
    (event.target as HTMLImageElement).src = 'https://placehold.co/500x750/e2e8f0/cbd5e1?text=N/A';
};
</script>
  
