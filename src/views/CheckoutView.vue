<template>
    <div class="max-w-4xl mx-auto">
        <button @click="goBack" class="mb-6 text-indigo-600 hover:text-indigo-800 font-semibold">
            <i class="fas fa-arrow-left mr-2"></i>Voltar para a loja
        </button>
        <h2 class="text-3xl font-bold text-gray-800 mb-6">Finalizar Compra</h2>
        <div v-if="cart.length === 0" class="text-center bg-white p-10 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold text-gray-700">Seu carrinho está vazio.</h3>
            <p class="text-gray-500 mt-2">Adicione filmes ao carrinho antes de finalizar a compra.</p>
        </div>
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-white p-8 rounded-lg shadow-md">
                <h3 class="text-xl font-bold mb-6">Seus Dados</h3>
                <form @submit.prevent="submitOrder" novalidate>
                    <div class="mb-4">
                        <label for="name" class="block text-sm font-medium text-gray-700">Nome Completo</label>
                        <input type="text" id="name" v-model.trim="form.name" required
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label for="cpf" class="block text-sm font-medium text-gray-700">CPF</label>
                            <input type="text" id="cpf" ref="cpfInput" v-model="form.cpf" required
                                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="000.000.000-00">
                        </div>
                        <div>
                            <label for="phone" class="block text-sm font-medium text-gray-700">Celular</label>
                            <input type="text" id="phone" ref="phoneInput" v-model="form.phone" required
                                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="(00) 00000-0000">
                        </div>
                    </div>
                    <div class="mb-4">
                        <label for="email" class="block text-sm font-medium text-gray-700">E-mail</label>
                        <input type="email" id="email" v-model.trim="form.email" required
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div class="sm:col-span-1">
                            <label for="cep" class="block text-sm font-medium text-gray-700">CEP</label>
                            <input type="text" id="cep" ref="cepInput" v-model="form.cep" required
                                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="00000-000">
                        </div>
                        <div class="sm:col-span-2">
                            <label for="address" class="block text-sm font-medium text-gray-700">Endereço</label>
                            <input type="text" id="address" v-model.trim="form.address" required
                                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                        </div>
                    </div>
                    <p v-if="formError" class="text-red-500 text-sm mb-4">{{ formError }}</p>
                </form>
            </div>

            <!-- Resumo do Pedido -->
            <div class="bg-white p-8 rounded-lg shadow-md h-fit">
                <h3 class="text-xl font-bold mb-6">Resumo do Pedido</h3>
                <div class="space-y-4">
                    <div v-for="item in cart" :key="item.id" class="flex justify-between items-center text-sm">
                        <div class="flex items-center">
                            <img :src="getImageUrl(item.poster_path)" @error="onImageError"
                                class="w-10 h-16 object-cover rounded mr-3" alt="Poster do Filme">
                            <div>
                                <p class="font-semibold text-gray-800">{{ item.title }}</p>
                                <p class="text-gray-500">Qtd: {{ item.quantity }}</p>
                            </div>
                        </div>
                        <p class="font-semibold text-gray-800">R$ {{ (item.price * item.quantity).toFixed(2) }}</p>
                    </div>
                </div>
                <div class="border-t mt-6 pt-6">
                    <div class="flex justify-between items-center">
                        <span class="text-lg font-bold text-gray-800">Total</span>
                        <span class="text-2xl font-bold text-indigo-600">R$ {{ cartTotal.toFixed(2) }}</span>
                    </div>
                </div>
                <button @click="submitOrder"
                    class="mt-6 w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
                    Finalizar e Pagar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import VMasker from 'vanilla-masker';

const store = useStore();
const emit = defineEmits(['order-success']);

const form = reactive({ name: '', cpf: '', phone: '', email: '', cep: '', address: '' });
const formError = ref('');
const cpfInput = ref<HTMLInputElement | null>(null);
const phoneInput = ref<HTMLInputElement | null>(null);
const cepInput = ref<HTMLInputElement | null>(null);

const cart = computed(() => store.state.cart);
const cartTotal = computed(() => store.getters.cartTotal);

onMounted(() => {
    if (cpfInput.value) VMasker(cpfInput.value).maskPattern("999.999.999-99");
    if (phoneInput.value) VMasker(phoneInput.value).maskPattern("(99) 99999-9999");
    if (cepInput.value) VMasker(cepInput.value).maskPattern("99999-999");
});

const goBack = () => store.commit('SET_CURRENT_PAGE', 'home');

const validateForm = () => {
    for (const key in form) {
        if (!form[key as keyof typeof form]) {
            formError.value = 'Por favor, preencha todos os campos.';
            return false;
        }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
        formError.value = 'Por favor, insira um e-mail válido.';
        return false;
    }
    formError.value = '';
    return true;
};

const submitOrder = () => {
    if (validateForm()) {
        emit('order-success', form.name);
        store.commit('CLEAR_CART');
    }
};

const getImageUrl = (path: string) => path ? `https://image.tmdb.org/t/p/w200${path}` : 'https://placehold.co/40x64/e2e8f0/cbd5e1?text=N/A';
const onImageError = (event: Event) => {
    (event.target as HTMLImageElement).src = 'https://placehold.co/40x64/e2e8f0/cbd5e1?text=N/A';
};
</script>
  
