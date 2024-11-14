<!-- DashboardCard.vue -->
<template>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between">
                <div>
                    <span class="block text-muted-color font-medium mb-4">{{ titulo }}</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ valor }}</div>
                </div>
                <div :class="['flex items-center justify-center rounded-border', bgColor]" style="width: 2.5rem; height: 2.5rem">
                    <i :class="['pi', icon, iconColor, '!text-xl']"></i>
                </div>
            </div>
            <span class="text-primary font-medium">{{ descricao }}</span>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    titulo: String,
    valor: String,
    descricao: String,
    icon: String,
    iconColor: String,
    bgColor: String
});
</script>
