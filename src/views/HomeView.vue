<template>
    <div>
        <h2 class="text-3xl font-bold text-gray-800 mb-6">Filmes Populares</h2>
        <div v-if="loading" class="text-center py-10">
            <i class="fas fa-spinner fa-spin fa-3x text-indigo-600"></i>
            <p class="mt-2 text-gray-600">Carregando filmes...</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import MovieCard from '../components/MovieCard.vue';

const store = useStore();

const loading = computed(() => store.state.loading);
const movies = computed(() => store.state.movies);
</script>
  
