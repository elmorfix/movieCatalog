<template>
    <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
        @click.self="$emit('close')">
        <div class="bg-white p-8 rounded-lg text-center max-w-sm w-full mx-4">
            <i class="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
            <h2 class="text-2xl font-bold mb-2">Obrigado, {{ customerName }}!</h2>
            <p class="text-gray-600 mb-6">Sua compra foi finalizada com sucesso!</p>
            <button @click="$emit('close')"
                class="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
                Continuar comprando
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
    customerName: string;
}>();

defineEmits(['close']);
</script>  
