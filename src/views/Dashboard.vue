<template>
    <div class="grid grid-cols-12 gap-8">
        <DashboardCard titulo="Pedidos" :valor="quantidadePedidos" descricao="24 novos desde a última visita" icon="pi-shopping-cart" iconColor="text-blue-500" bgColor="bg-blue-100" />
        <DashboardCard titulo="Receita" :valor="formatCurrency(valorTotalPedidos)" descricao="+52% em relação à semana passada" icon="pi-dollar" iconColor="text-orange-500" bgColor="bg-orange-100" />
        <DashboardCard titulo="Clientes" :valor="quantidadeClientesUnicos" descricao="520 novos registros" icon="pi-users" iconColor="text-cyan-500" bgColor="bg-cyan-100" />
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
                            {{ formatCurrency(valorTotalPedidos) }}
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
                <div class="font-semibold text-xl">Clientes ativos e inativos</div>
                <div class="text-xl mb-5 text-muted-color" style="font-size: 0.8rem;">Últimos 24 meses</div>
                <Chart type="bar" :data="chartData" :options="chartOptions" class="h-80" />
            </div>
            <CardNotificacao />
        </div>
    </div>
</template>

<script>
import CardMelhoresVendas from '@/components/CardMelhoresVendas.vue';
import CardNotificacao from '@/components/CardNotificacao.vue';
import DashboardCard from '@/components/DashboardCard.vue';
import DashboardVendasRecentes from '@/components/DashboardVendasRecentes.vue';
import axios from 'axios';
export default {
    components: {
        CardMelhoresVendas,
        CardNotificacao,
        DashboardCard,
        DashboardVendasRecentes
    },
    data() {
        return {
            products: null,
            chartData: null,
            chartOptions: null,
            value: 50,
            quantidadePedidos: 0,
            valorTotalPedidos: 0,
            quantidadeClientesUnicos: 0
        };
    },
    methods: {
        async setChartData() {
            const documentStyle = getComputedStyle(document.documentElement);

            try {
                // Realiza a chamada ao endpoint e processa os dados
                const response = await axios.get('http://192.168.102.9/api/relatorio/pedido/clientesativosinativos');
                if (response.status === 200) {
                    const data = response.data;

                    // Agrupa e soma a quantidade de clientes por estado e status
                    const groupedData = data.reduce((acc, curr) => {
                        const estado = curr.estado;
                        const status = curr.status_cliente; // 'ativo' ou 'inativo'

                        if (!acc[estado]) {
                            acc[estado] = { ativo: 0, inativo: 0 };
                        }
                        acc[estado][status] += parseInt(curr.quantidade);
                        return acc;
                    }, {});

                    // Extrai estados e quantidades para o gráfico
                    const labels = Object.keys(groupedData);
                    const dataAtivos = labels.map((estado) => groupedData[estado].ativo);
                    const dataInativos = labels.map((estado) => groupedData[estado].inativo);

                    console.log(labels, dataAtivos, dataInativos);

                    // Define os dados do gráfico
                    this.chartData = {
                        labels,
                        datasets: [
                            {
                                type: 'bar',
                                label: 'Clientes ativos',
                                backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
                                data: dataAtivos,
                                barThickness: 20
                            },
                            {
                                type: 'bar',
                                label: 'Clientes inativos',
                                backgroundColor: documentStyle.getPropertyValue('--p-primary-300'),
                                data: dataInativos,
                                barThickness: 20
                            }
                        ]
                    };
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        },
        setChartOptions() {
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
        },
        formatCurrency(value) {
            return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        },
        updateChart() {
            this.chartData = this.setChartData();
            this.chartOptions = this.setChartOptions();
        },
        async getPedidosRecentes() {
            const response = await axios.get('http://192.168.102.9/api/relatorio/pedido/recentes');
            if (response.status == 200) {
                this.products = response.data;
                this.quantidadePedidos = response.data.length;
                this.valorTotalPedidos = this.products.reduce((total, product) => total * 1 + product.total * 1, 0);
                this.quantidadeClientesUnicos = this.products.reduce((acc, product) => {
                    if (!acc.includes(product.codigo)) {
                        acc.push(product.codigo);
                    }
                    return acc;
                }, []).length;
            }
        }
    },
    mounted() {
        this.getPedidosRecentes();
        this.setChartData();
        this.setChartOptions();
        //ProductService.getProductsSmall().then((data) => (this.products = data));
        this.chartData = this.setChartData();
        this.chartOptions = this.setChartOptions();
    },
    watch: {
        '$root.isDarkTheme': 'updateChart',
        '$root.primary': 'updateChart',
        '$root.surface': 'updateChart'
    }
};
</script>
