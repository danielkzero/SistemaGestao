<template>
    <Select
        :model-value="modelValue"
        @update:modelValue="updateSelectedDashboard"
        :options="options"
        optionLabel="name"
        placeholder="Selecione um dashboard"
        class="w-full md:w-96"
    >
        <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center">
                <div>{{ slotProps.value.name }}</div>
            </div>
            <span v-else>
                {{ slotProps.placeholder }}
            </span>
        </template>
        
        <template #option="slotProps">
            <div class="flex items-center justify-between w-full">
                <div>{{ slotProps.option.name }}</div>
                <div class="flex space-x-2">
                    <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click.stop="onEditDashboard(slotProps.option)" />
                    <Button icon="pi pi-trash" class="p-button-text p-button-sm" @click.stop="onDeleteDashboard(slotProps.option)" />
                </div>
            </div>
        </template>
        
        <template #dropdownicon>
            <i class="pi pi-chart-bar" />
        </template>
        
        <template #footer>
            <div class="p-3">
                <Button label="Novo" fluid severity="secondary" text size="small" icon="pi pi-plus" @click="onAddNewDashboard" />
            </div>
        </template>
    </Select>
</template>

<script>
export default {
    name: 'DashboardSelect',
    props: {
        modelValue: {
            type: Object,
            required: true
        },
        options: {
            type: Array,
            required: true
        }
    },
    emits: ['update:modelValue', 'editDashboard', 'deleteDashboard', 'addNewDashboard'],
    methods: {
        updateSelectedDashboard(value) {
            this.$emit('update:modelValue', value);
        },
        onEditDashboard(option) {
            this.$emit('editDashboard', option);
        },
        onDeleteDashboard(option) {
            this.$emit('deleteDashboard', option);
        },
        onAddNewDashboard() {
            this.$emit('addNewDashboard');
        }
    }
}
</script>
