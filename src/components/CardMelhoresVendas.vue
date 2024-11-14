<template>
    <div class="card m-0 px-0">
        <div class="flex justify-between items-center mb-6 px-8">
            <div class="font-semibold text-xl">Melhores grupos</div>
            <div>
                <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu2.toggle($event)"></Button>
                <Menu ref="menu2" :popup="true" :model="items" class="!min-w-40"></Menu>
            </div>
        </div>
        <div class="max-h-96 overflow-auto mx-4 px-4">
            <ul class="list-none p-0 m-0">
                <!-- Renderização dos produtos com v-for -->
                <li v-for="(product, index) in products" :key="index" class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">
                            <span class="mt-1 text-muted-color">({{ product.codigo }})</span> {{ product.grupo }}
                        </span>
                    </div>
                    <div class="mt-2 md:mt-0 flex items-center">
                        <div class="me-3">
                            {{ formatCurrency(product.total) }}
                        </div>
                        <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                            <div :class="product.color" class="h-full" :style="{ width: product.percentual + '%' }"></div>
                        </div>
                        <span :class="(product.color ?? 'bg-primary').replace('bg-', 'text-')" class="ml-4 font-medium">{{ formatPercent(product.percentual) }}</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            products: this.generateProducts(), // Chama a função para gerar os produtos aleatórios
            items: [
                { label: 'Configurar', icon: 'pi pi-fw pi-cog' },
                { label: 'Remover', icon: 'pi pi-fw pi-trash' }
            ]
        };
    },
    async mounted() {
        // Executa quando a página é carregada
        this.generateProducts();
    },
    methods: {
        // Função que gera produtos com valores e percentuais aleatórios
        async generateProducts() {
            let productNames = [];
            try {
                const response = await axios.get('http://192.168.102.9/api/relatorio/pedido/melhoresgrupos');
                if (response.status == 200) {
                    productNames = response.data;
                    for (var i = 0; i < productNames.length; i++) {
                        productNames[i].color = this.randomColor(); // Cor aleatória do Tailwind
                    }
                }
            } catch (e) {
                console.error('Erro ao carregar dados:', e);
            } finally {
                this.products = productNames;
            }
        },
        randomColor() {
            // Defina uma lista de cores do Tailwind para escolher aleatoriamente
            const colors = [
                'bg-blue-500', // Azul
                'bg-orange-500', // Laranja
                'bg-green-500', // Verde
                'bg-red-500', // Vermelho
                'bg-purple-500', // Roxo
                'bg-pink-500', // Rosa
                'bg-yellow-500', // Amarelo
                'bg-teal-500', // Verde-água
                'bg-indigo-500', // Índigo
                'bg-gray-500' // Cinza
            ];

            // Escolha uma cor aleatoriamente
            const randomIndex = Math.floor(Math.random() * colors.length);
            return colors[randomIndex].toString();
        },
        bgColor(color) {
            return 'bg-' + color + '-500';
        },
        // Formata o valor como moeda no formato brasileiro
        formatCurrency(value) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value);
        },

        // Formata o percentual com uma casa decimal
        formatPercent(value) {
            return `${parseFloat(value).toFixed(1)}%`;
        }
    }
};
</script>
