
<template>
    <div class="card">
        <div class="flex justify-between items-center mb-6">
            <div class="font-semibold text-xl">Melhores grupos</div>
            <div>
                <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu2.toggle($event)"></Button>
                <Menu ref="menu2" :popup="true" :model="items" class="!min-w-40"></Menu>
            </div>
        </div>
        <ul class="list-none p-0 m-0">
            <!-- Renderização dos produtos com v-for -->
            <li v-for="(product, index) in products" :key="index" class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">{{ product.name }}</span>
                    <div class="mt-1 text-muted-color">{{ product.category }}</div>
                </div>
                <div class="mt-2 md:mt-0 flex items-center">
                    <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                        <div :class="bgColor(product.color)" class="h-full" :style="{ width: product.percentage + '%' }"></div>
                    </div>
                    <span :class="`text-${product.color}-500`" class="ml-4 font-medium">{{ product.percentage }}%</span>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    data() {
        return {
            products: this.generateProducts() // Chama a função para gerar os produtos aleatórios
        };
    },
    methods: {
        // Função que gera produtos com valores e percentuais aleatórios
        generateProducts() {
            const productNames = [
                { name: 'Torneiras', category: 'Hidráulica', color: 'blue' },
                { name: 'Vasos', category: 'Sanitário', color: 'orange' },
                { name: 'Mangueiras', category: 'Hidráulica', color: 'green' },
                { name: 'Acionamento de Descarga', category: 'Sanitário', color: 'purple' },
                { name: 'Válvulas', category: 'Hidráulica', color: 'teal' },
                { name: 'Bobinas', category: 'Peças', color: 'orange' }
            ];

            // Adiciona um percentual aleatório para cada produto
            return productNames.map((product) => ({
                ...product,
                percentage: Math.floor(Math.random() * 81) + 10 // Percentual entre 10% e 90%
            }));
        },
        bgColor(color) {
            return 'bg-' + color + '-500';
        }
    }
};
</script>