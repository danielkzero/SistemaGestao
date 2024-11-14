<!-- RecentSales.vue -->
<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Vendas Recentes</div>
        <DataTable :value="products" :paginator="true" :rows="5" responsiveLayout="scroll">
            <Column field="gestor" header="Gestor" :sortable="true" style="width: 10%"></Column>
            <Column field="clientCode" header="Cód.Cliente" :sortable="true" style="width: 15%"></Column>
            <Column field="clientName" header="Cliente" :sortable="true" style="width: 35%"></Column>
            <Column field="amount" header="Valor" :sortable="true" style="width: 15%">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.amount) }}
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    products: {
        type: Array
    }
});

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}
</script>
