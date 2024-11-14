<!-- RecentSales.vue -->
<template>
    <DataTable :value="products" :paginator="true" :rows="5" responsiveLayout="scroll">
        <Column field="codigo" header="Gestor" :sortable="true" style="width: 5%"></Column>
        <Column field="cliente" header="Cliente" :sortable="true" style="width: 60%">
            <template #body="slotProps"> {{ slotProps.data.cod_cliente }} - {{ slotProps.data.cliente }} </template>
        </Column>
        <Column field="total" header="Valor" :sortable="true" style="width: 15%">
            <template #body="slotProps">
                {{ formatCurrency(slotProps.data.total) }}
            </template>
        </Column>
    </DataTable>
</template>

<script>
export default {
    props: {
        products: { type: Array, default: [] }
    },
    methods: {
        formatCurrency(value) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value);
        }
    }
};
</script>
