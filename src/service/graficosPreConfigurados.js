export const graficosPreConfigurados = [
    { id: 1, tipo: 'bar', titulo: 'Clientes ativos e inativos', icon: 'pi pi-users', chartOptions: setChartOptions(), endpoint: '/api/relatorio/pedido/clientesativosinativos' },
    { id: 2, tipo: 'bar', titulo: 'Gráfico de vendas', icon: 'pi pi-chart-bar', chartOptions: setChartOptions(), endpoint: '/api/relatorio/pedido/mensalrepresentante' },
    { id: 3, tipo: 'vendasrecentes', titulo: 'Vendas Recentes', icon: 'pi pi-shopping-cart', endpoint: '/api/relatorio/pedido/recentes' },
    { id: 4, tipo: 'card', titulo: 'Quantidade de pedidos', icon: 'pi pi-file', endpoint: '/api/relatorio/pedido/quantidadepedido' },
    { id: 5, tipo: 'card', titulo: 'Quantidade de supervisores', icon: 'pi pi-id-card', endpoint: '/api/relatorio/pedido/quantidadesupervisor' },
    { id: 6, tipo: 'card', titulo: 'Quantidade de representantes', icon: 'pi pi-user', endpoint: '/api/relatorio/pedido/quantidaderepresentante' }
];

export default function setChartOptions() {
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
};