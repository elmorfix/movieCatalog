<template>
    <aside
        :class="['sidebar', 'fixed', 'top-0', 'right-0', 'w-full', 'sm:w-96', 'h-full', 'bg-white', 'shadow-2xl', 'z-50', '', 'flex', 'flex-col', showCart ? 'sidebar-open' : 'sidebar-closed']">
        <div class="flex justify-between items-center mb-6 bg-indigo-400 p-6">
            <h3 class="text-2xl font-bold text-slate-100">Meu Carrinho</h3>
            <button @click="toggleCart"
                class="rounded-md cursor-pointer hover:bg-slate-100 text-black/40 text-lg px-4 pb-1 font-bold">
                x
            </button>
        </div>
        <div v-if="cart.length === 0" class="flex-grow flex items-center justify-center text-center text-gray-500">
            <p>Seu carrinho está vazio.</p>
        </div>
        <div v-else class="flex-grow overflow-y-auto -mr-6 pr-6 px-4">
            <div v-for="item in cart" :key="item.id"
                class="flex items-center mb-4 border-dashed border-indigo-100/50 border-b-2 pb-4">
                <img :src="getImageUrl(item.poster_path)" @error="onImageError"
                    class="w-16 h-24 object-cover rounded-md mr-4" alt="Poster do Filme">
                <div class="flex-grow">
                    <h4 class="font-bold text-sm">{{ item.title }}</h4>
                    <p class="text-sm text-gray-600">Qtd: {{ item.quantity }}</p>
                    <p class="text-indigo-600 font-semibold">R$ {{ (item.price * item.quantity).toFixed(2) }}</p>
                </div>
                <button @click="removeFromCart(item.id)" class="text-red-500 hover:text-red-700"
                    title="Remover do carrinho">
                    <div class="hover:cursor-pointer hover:bg-red-200 rounded-xl px-2 transition-colors duration-300">
                        <CloseIcon />
                    </div>
                </button>
            </div>
        </div>
        <div v-if="cart.length > 0" class="mt-auto pt-6 border-t px-4">
            <div class="flex justify-between items-center mb-4">
                <span class="text-lg font-bold text-gray-800">Total:</span>
                <span class="text-xl font-bold text-indigo-600">R$ {{ cartTotal.toFixed(2) }}</span>
            </div>
            <button @click="goToCheckout"
                class="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300 cursor-pointer">
                Finalizar Compra
            </button>
            <button @click="clearCart" class="w-full mt-2 text-sm text-gray-500 hover:text-red-500 cursor-pointer">
                Esvaziar carrinho
            </button>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import CloseIcon from '../assets/close.svg?component';

const store = useStore();

const showCart = computed(() => store.state.showCart);
const cart = computed(() => store.state.cart);
const cartTotal = computed(() => store.getters.cartTotal);

const toggleCart = () => store.commit('TOGGLE_CART_VISIBILITY');
const removeFromCart = (id: number) => store.commit('REMOVE_FROM_CART', id);
const clearCart = () => store.commit('CLEAR_CART');
const goToCheckout = () => {
    store.commit('SET_CURRENT_PAGE', 'checkout');
    store.commit('CLOSE_SIDEBARS');
};

const getImageUrl = (path: string) => path ? `https://image.tmdb.org/t/p/w200${path}` : 'https://placehold.co/64x96/e2e8f0/cbd5e1?text=N/A';
const onImageError = (event: Event) => {
    (event.target as HTMLImageElement).src = 'https://placehold.co/64x96/e2e8f0/cbd5e1?text=N/A';
};
</script>
  
