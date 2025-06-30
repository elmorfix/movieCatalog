<template>
  <div class="font-sans">
    <AppHeader />

    <main class="container mx-auto p-4 sm:p-6 lg:p-8">
      <HomeView v-if="currentPage === 'home'" />
      <CheckoutView v-if="currentPage === 'checkout'" @order-success="showSuccess" />
    </main>

    <FavoritesSidebar />
    <CartSidebar />

    <SuccessModal v-if="showSuccessModal" :customer-name="customerName" @close="hideSuccess" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import AppHeader from './components/AppHeader.vue';
import HomeView from './views/HomeView.vue';
import CheckoutView from './views/CheckoutView.vue';
import CartSidebar from './components/CartSidebar.vue';
import FavoritesSidebar from './components/FavoritesSidebar.vue';
import SuccessModal from './components/SuccessModal.vue';

const store = useStore();

const currentPage = computed(() => store.state.currentPage);
const showSuccessModal = ref(false);
const customerName = ref('');

const showSuccess = (name: string) => {
  customerName.value = name.split(' ')[0];
  showSuccessModal.value = true;
};

const hideSuccess = () => {
  showSuccessModal.value = false;
  store.commit('SET_CURRENT_PAGE', 'home');
};

onMounted(() => {
  store.dispatch('fetchMovies');
});
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
}
.sidebar {
  transition: transform 0.3s ease-in-out;
}
.sidebar-open {
  transform: translateX(0);
}
.sidebar-closed {
  transform: translateX(100%);
}
</style>
