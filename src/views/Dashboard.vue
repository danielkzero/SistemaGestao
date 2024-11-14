<template>
    <div class="grid grid-cols-12 gap-8">
        <DashboardCard titulo="Pedidos" valor="152" descricao="24 novos desde a última visita" icon="pi-shopping-cart" iconColor="text-blue-500" bgColor="bg-blue-100" />
        <DashboardCard titulo="Receita" valor="R$2.100" descricao="+52% em relação à semana passada" icon="pi-dollar" iconColor="text-orange-500" bgColor="bg-orange-100" />
        <DashboardCard titulo="Clientes" valor="28.441" descricao="520 novos registros" icon="pi-users" iconColor="text-cyan-500" bgColor="bg-cyan-100" />
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0 min-h-44">
                <div class="flex justify-between">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Meta</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium">
                            <span class="text-3xl">2M</span>
                            <span class="text-xl">/4M</span>
                        </div>
                        <div class="mt-3">
                            R$ 2.000.000,00
                        </div>
                    </div>
                    <div>
                        <Knob v-model="value" valueTemplate="{value}%" :size="80" />
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
            <DashboardVendasRecentes :products="products" />
            <CardMelhoresVendas />
        </div>

        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Clientes ativos e inativos</div>
                <Chart type="bar" :data="chartData" :options="chartOptions" class="h-80" />
            </div>
            <CardNotificacao />
        </div>
    </div>
</template>

<script setup>
import CardMelhoresVendas from '@/components/CardMelhoresVendas.vue';
import CardNotificacao from '@/components/CardNotificacao.vue';
import DashboardCard from '@/components/DashboardCard.vue';
import DashboardVendasRecentes from '@/components/DashboardVendasRecentes.vue';
import { useLayout } from '@/layout/composables/layout';
import { ProductService } from '@/service/ProductService';
import { onMounted, ref, watch } from 'vue';

const { getPrimary, getSurface, isDarkTheme } = useLayout();

const products = ref(null);
const chartData = ref(null);
const chartOptions = ref(null);

const items = ref([
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-trash' }
]);

const value = ref(50);
onMounted(() => {
    ProductService.getProductsSmall().then((data) => (products.value = data));
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

function setChartData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const estados = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

    // Embaralha os estados e pega os primeiros 10
    const labels = estados.sort(() => 0.5 - Math.random()).slice(0, 10);

    // Função para gerar um número aleatório dentro de um intervalo
    const randomValue = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // Gera valores aleatórios para clientes ativos e inativos para cada estado
    const dataAtivos = labels.map(() => randomValue(5, 30));
    const dataInativos = labels.map(() => randomValue(10, 70));

    return {
        labels,
        datasets: [
            {
                type: 'bar',
                label: 'Clientes ativos',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
                data: dataAtivos,
                barThickness: 32
            },
            {
                type: 'bar',
                label: 'Clientes inativos',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-300'),
                data: dataInativos,
                barThickness: 32
            }
        ]
    };
}

function setChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: textMutedColor
                },
                grid: {
                    color: 'transparent',
                    borderColor: 'transparent'
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: textMutedColor
                },
                grid: {
                    color: borderColor,
                    borderColor: 'transparent',
                    drawTicks: false
                }
            }
        }
    };
}

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

watch([getPrimary, getSurface, isDarkTheme], () => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});
</script>
