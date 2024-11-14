<template>
    <div>
        <div class="mb-8">
            <!-- Botão para adicionar Gráfico -->
            <div class="card p-4">
                <div class="flex justify-center w-full gap-4">
                    <Button label="Globais" icon="pi pi-cog" @click="abrirPainelInferior = !abrirPainelInferior" :disabled="selectedDashboards.length <= 0" />
                    <Button label="Adicionar Gráfico" icon="pi pi-plus" @click="modalAberto = true" :disabled="selectedDashboards.length <= 0" />

                    <DashboardSelector
                        :options="Dashboards"
                        :modelValue="selectedDashboards"
                        @update:modelValue="selectedDashboards = $event"
                        @editDashboard="editDashboardName"
                        @deleteDashboard="deleteDashboard"
                        @addNewDashboard="openModalDashboardNome = true"
                    />

                    <!-- Botão para salvar estado do dashboard -->
                    <Button label="Salvar Dashboard" icon="pi pi-save" @click="salvarDashboard" :disabled="selectedDashboards.length <= 0" />
                    <!-- Botão para carregar estado do dashboard -->
                </div>
                <Transition name="fade-slide">
                    <div v-if="abrirPainelInferior">
                        <div class="grid grid-cols-12 gap-2">
                            <div class="col-span-12 lg:col-span-12 xl:col-span-12">
                                <div class="flex justify-start w-full gap-4 pt-3 mt-4 border-t-2">
                                    <div class="field">
                                        <label for="periodo">Período:</label>
                                        <Select v-model="configuracaoSelecionada.periodo" :options="opcoesPeriodo" optionLabel="label" optionValue="value" class="w-full"> </Select>
                                    </div>
                                    <div class="field">
                                        <label for="status">Empresas</label>
                                        <MultiSelect v-model="configuracaoSelecionada.empresa" filter class="w-full" :options="opcoesEmpresa" optionLabel="label" optionValue="value" placeholder="Selecione as empresas" />
                                    </div>
                                    <div class="field">
                                        <label for="status">Represenantes</label>
                                        <MultiSelect
                                            v-model="configuracaoSelecionada.representante"
                                            filter
                                            filterPlaceholder="Digite para buscar..."
                                            class="w-full"
                                            :options="opcoesRepresentante"
                                            optionLabel="label"
                                            optionValue="value"
                                            placeholder="Selecione os representantes"
                                        />
                                    </div>
                                    <div class="field">
                                        <label for="status">Status</label>
                                        <MultiSelect v-model="configuracaoSelecionada.status" filter class="w-full" :options="opcoesStatus" optionLabel="label" optionValue="value" placeholder="Selecione os status" />
                                    </div>
                                </div>
                            </div>

                            <div class="col-span-12 lg:col-span-12 xl:col-span-12">
                                <div class="flex justify-start w-full gap-4">
                                    <div class="field">
                                        <label for="metas">Meta geral</label>
                                        <InputNumber v-model="MetasGeral" inputId="integeronly" fluid />
                                    </div>
                                    <div class="field" v-for="item in ListaMetas">
                                        <label for="metas">Meta {{ item.nome }}</label>
                                        <InputText id="metas" variant="filled" class="w-full" :value="formatCurrency(MetasGeral * item.valor, 2)" />
                                        <template v-if="item.nome == 'valeplast' || item.nome == 'global' || item.nome == 'televendas'">
                                            <strong>{{ formatCurrency((MetasGeral * item.valor) / PopulacaoTotal, 3) }}</strong> <small>/ habitante</small>
                                        </template>
                                    </div>
                                </div>
                            </div>

                            <div class="col-span-12 lg:col-span-12 xl:col-span-12">
                                <div class="flex justify-start w-full gap-4">
                                    <div class="field">
                                        <Button label="Aplicar a todos" icon="pi pi-check" @click="aplicarConfiguracaoATodos" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
        <Dialog header="Editando nome do Dashboard" v-model:visible="openModalDashboardNomeEdit" :style="{ width: '30rem' }">
            <div class="flex flex-col gap-2">
                <FloatLabel variant="in" class="w-full">
                    <InputText id="in_label" v-model="editedDashboard.name" variant="filled" class="w-full" />
                    <label for="in_label">Nome do Dashboard</label>
                </FloatLabel>
                <Button type="button" severity="secondary" label="Alterar" @click="salvarNomeDashboardEdit(editedDashboard)" />
            </div>
        </Dialog>

        <Dialog header="Nome do seu novo Dashboard" v-model:visible="openModalDashboardNome" :style="{ width: '30rem' }">
            <div class="flex flex-col gap-2">
                <FloatLabel variant="in" class="w-full">
                    <InputText id="in_label" v-model="NomeDashboard" variant="filled" class="w-full" />
                    <label for="in_label">Nome do Dashboard</label>
                </FloatLabel>
                <Button type="button" severity="secondary" label="Adicionar" @click="salvarNomeDashboard" />
            </div>
        </Dialog>

        <Dialog header="Escolha um gráfico para adicionar" v-model:visible="modalAberto" :style="{ width: '50vw' }">
            <div class="grid grid-cols-12 gap-4 p-4">
                <div v-for="grafico in graficosPreConfigurados" :key="grafico.id" class="col-span-4 lg:col-span-4 xl:col-span-4 border">
                    <div class="card p-3 flex flex-column align-items-center text-center cursor-pointer hover:shadow-2" @click="adicionarGrafico(grafico)">
                        <i :class="grafico.icon" class="mb-2 me-2 text-primary"></i>
                        <span class="font-medium">{{ grafico.titulo }}</span>
                    </div>
                </div>
            </div>
        </Dialog>

        <Dialog header="Configuração do Gráfico" v-model:visible="configuracaoModalAberto" :style="{ width: '40vw' }">
            <div class="p-4">
                <div class="field">
                    <label class="block mb-2">Período:</label>
                    <Select v-model="configuracaoSelecionada.periodo" :options="opcoesPeriodo" optionLabel="label" optionValue="value" class="w-full mb-4"> </Select>
                </div>
                <div class="field">
                    <label for="status">Empresas</label>
                    <MultiSelect v-model="configuracaoSelecionada.empresa" filter class="w-full mb-4" :options="opcoesEmpresa" optionLabel="label" optionValue="value" placeholder="Selecione as empresas" />
                </div>
                <div class="field">
                    <label for="status">Represenantes</label>
                    <MultiSelect
                        v-model="configuracaoSelecionada.representante"
                        filter
                        filterPlaceholder="Digite para buscar..."
                        class="w-full mb-4"
                        :options="opcoesRepresentante"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Selecione os representantes"
                    />
                </div>
                <div class="field">
                    <label for="status">Status</label>
                    <MultiSelect v-model="configuracaoSelecionada.status" filter class="w-full mb-4" :options="opcoesStatus" optionLabel="label" optionValue="value" placeholder="Selecione os status" />
                </div>

                <Button label="Aplicar" icon="pi pi-check" @click="aplicarConfiguracao" />
            </div>
        </Dialog>

        <Draggable v-model="graficosNoDashboard" item-key="id_componente" class="grid grid-cols-12 gap-8">
            <template v-for="element in graficosNoDashboard">
                <template v-if="element.tipo === 'bar'">
                    <div class="col-span-12 lg:col-span-6 xl:col-span-6">
                        <div class="card">
                            <div class="flex justify-between items-center">
                                <div class="font-semibold text-xl">{{ element.titulo }}</div>
                                <div>
                                    <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="toggleMenu(element.id_componente, $event)" />
                                    <Menu :ref="'menu-' + element.id_componente" :popup="true" :model="getMenuItems(element)" class="!min-w-40" />
                                </div>
                            </div>
                            <Chart :type="element.tipo" :data="dadosGraficos[element.id_componente]" :options="element?.chartOptions ?? null" class="h-96" />
                            <div v-if="Object.keys(configuracoesGraficos[element.id_componente]).length > 0" class="flex justify-start gap-2 mt-4">
                                <GraficoMensagem
                                    v-for="tipo in ['empresa', 'representante', 'periodo', 'status']"
                                    :key="tipo"
                                    :messageType="tipo"
                                    :configuracao="configuracoesGraficos[element.id_componente]"
                                    :opcoesEmpresa="opcoesEmpresa"
                                    :opcoesRepresentante="opcoesRepresentante"
                                />
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else-if="element.tipo === 'card'">
                    <div class="col-span-12 lg:col-span-3 xl:col-span-3">
                        <div class="card">
                            <div class="flex justify-between">
                                <div>
                                    <span class="block text-muted-color font-medium mb-4">{{ element.titulo }}</span>
                                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ dadosGraficos[element.id_componente]?.valor }}</div>
                                    <div v-if="Object.keys(configuracoesGraficos[element.id_componente]).length > 0" class="flex justify-start gap-2 mt-4">
                                        <GraficoMensagem
                                            v-for="tipo in ['empresa', 'representante', 'periodo', 'status']"
                                            :key="tipo"
                                            :messageType="tipo"
                                            :configuracao="configuracoesGraficos[element.id_componente]"
                                            :opcoesEmpresa="opcoesEmpresa"
                                            :opcoesRepresentante="opcoesRepresentante"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="toggleMenu(element.id_componente, $event)" />
                                    <Menu :ref="'menu-' + element.id_componente" :popup="true" :model="getMenuItems(element)" class="!min-w-40" />
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else-if="element.tipo === 'vendasrecentes'">
                    <div class="col-span-12 lg:col-span-6 xl:col-span-6">
                        <div class="card">
                            <div class="flex justify-between items-center">
                                <div class="font-semibold text-xl">{{ element.titulo }}</div>
                                <div>
                                    <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="toggleMenu(element.id_componente, $event)" />
                                    <Menu :ref="'menu-' + element.id_componente" :popup="true" :model="getMenuItems(element)" class="!min-w-40" />
                                </div>
                            </div>
                            <DashboardVendasRecentes :products="dadosGraficos[element.id_componente]" class="min-h-96" />
                            <div v-if="Object.keys(configuracoesGraficos[element.id_componente]).length > 0" class="flex justify-start gap-2 mt-4">
                                <GraficoMensagem
                                    v-for="tipo in ['empresa', 'representante', 'periodo', 'status']"
                                    :key="tipo"
                                    :messageType="tipo"
                                    :configuracao="configuracoesGraficos[element.id_componente]"
                                    :opcoesEmpresa="opcoesEmpresa"
                                    :opcoesRepresentante="opcoesRepresentante"
                                />
                            </div>
                        </div>
                    </div>
                </template>
            </template>
        </Draggable>
    </div>
</template>

<script>
import DashboardVendasRecentes from '@/components/DashboardVendasRecentes.vue';
import GraficoMensagem from '@/components/GraficoMensagem.vue';
import IbgeData from '@/components/IbgeData.vue';
import formatCurrency from '@/service/Converts';
import { graficosPreConfigurados } from '@/service/graficosPreConfigurados';
import uniqid from '@/service/Uniqid';
import axios from 'axios';
import Swal from 'sweetalert2';
import { VueDraggableNext } from 'vue-draggable-next';
import DashboardSelector from './DashboardSelector.vue';

export default {
    components: { Draggable: VueDraggableNext, DashboardVendasRecentes, GraficoMensagem, IbgeData, DashboardSelector },
    data() {
        return {
            MetasGeral: 4400000,
            ListaMetas: [
                { nome: 'ecommerce', tipo: 'p', valor: 0.0227272727272727 },
                { nome: 'licitação', tipo: 'p', valor: 0.0113636363636364 },
                { nome: 'televendas', tipo: 'p', valor: 0.227272727272727 },
                { nome: 'global', tipo: 'p', valor: 0.221590909090909 },
                { nome: 'valeplast', tipo: 'p', valor: 0.517045454545455 }
            ],
            PopulacaoTotal: 190825817,
            NomeDashboard: null,
            editedDashboard: null,
            openModalDashboardNomeEdit: false,
            openModalDashboardNome: false,
            abrirPainelInferior: false,
            selectedDashboards: [],
            Dashboards: [],
            modalAberto: false,
            configuracaoModalAberto: false,
            graficosPreConfigurados: graficosPreConfigurados,
            idComponenteDashboard: null,
            graficosNoDashboard: [],
            dadosGraficos: {},
            configuracoesGraficos: {}, // Armazena configurações para cada gráfico por ID
            configuracaoSelecionada: {}, // Configuração temporária do gráfico em edição
            graficoAtualConfiguracao: null, // Referência ao gráfico em configuração
            empresas: [], // Dados simulados ou recebidos de API
            representantes: [],
            status: [], // Status
            opcoesStatus: [{ label: '', value: '' }],
            opcoesEmpresa: [{ label: '', value: '' }],
            opcoesRepresentante: [{ label: '', value: '' }],
            opcoesPeriodo: [
                { label: 'Último mês', value: '1' },
                { label: 'Últimos 2 meses', value: '2' },
                { label: 'Últimos 3 meses', value: '3' }
            ]
        };
    },
    watch: {
        selectedDashboards(selectedDashboards) {
            if (selectedDashboards) {
                this.selecionarDashboard(selectedDashboards.code);
            }
        }
    },
    methods: {
        formatCurrency,
        editDashboardName(dashboard) {
            this.editedDashboard = dashboard;
            this.openModalDashboardNomeEdit = true;
        },
        async deleteDashboard(dashboard) {
            // Exibe a confirmação antes de tentar excluir
            const confirmation = await Swal.fire({
                icon: 'question',
                title: 'Confirmação',
                text: `Deseja realmente excluir o dashboard?`,
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não'
            });

            // Se o usuário confirmar a ação
            if (confirmation.isConfirmed) {
                try {
                    // Chama o endpoint de exclusão
                    const response = await axios.delete(`/api/relatorio/${dashboard.option.code}/dashboard`);

                    // Verifica a resposta e notifica o usuário
                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Sucesso',
                            text: 'Dashboard excluído com sucesso!'
                        });
                        // Atualiza a lista de dashboards, removendo o excluído
                        this.Dashboards = this.Dashboards.filter((d) => d.code !== dashboard.option.code);
                    } else {
                        throw new Error('Erro ao excluir o dashboard');
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: 'Não foi possível excluir o dashboard. Tente novamente mais tarde.'
                    });
                }
            }
            await this.carregarDashboard();
        },
        async salvarDashboard() {
            try {
                if (this.selectedDashboards) {
                    const payload = {
                        id_componente: this.idComponenteDashboard ?? this.uniqid(),
                        nome: this.selectedDashboards.name ?? this.uniqid(),
                        graficos: this.graficosNoDashboard,
                        configuracoes: this.configuracoesGraficos
                    };
                    const response = await axios.post('/api/relatorio/pedido/salvarrelatorio', payload);
                    Swal.fire({
                        icon: 'success',
                        title: 'Sucesso',
                        text: 'Dashboard salvo com sucesso!',
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Atenção',
                        text: 'Nenhum dashboard selecionado!'
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Ocorreu um erro ao salvar o dashboard.',
                    footer: error.message
                });
            }
            await this.carregarDashboard();
        },
        async salvarNomeDashboard() {
            this.Dashboards.push({ name: this.NomeDashboard, code: null });
            this.selectedDashboards = { name: this.NomeDashboard, code: null };
            this.openModalDashboardNome = false;
        },
        async esperar(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
        async salvarNomeDashboardEdit(dashboard) {
            // substituir o anterior...
            const index = this.Dashboards.findIndex((d) => d.code === dashboard.code);

            if (index !== -1) {
                // Substitui o dashboard existente pelo novo
                this.Dashboards.splice(index, 1, dashboard);
            }
            this.selectedDashboards = dashboard;
            this.openModalDashboardNomeEdit = false;

            // Espera 500ms antes de salvar
            await this.esperar(500);

            await this.salvarDashboard();
        },
        async carregarDashboard() {
            try {
                const response = await axios.get('/api/relatorio/pedido/salvarrelatorio');
                this.Dashboards = [];
                this.Dashboards = response.data.Dashboards;
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao carregar o dashboard.',
                    footer: error.message
                });
            }
        },
        uniqid,
        async selecionarDashboard(id) {
            try {
                // Caso não exista dados no relatorio
                const response = await axios.get('/api/relatorio/' + id + '/dashboard');

                this.graficosNoDashboard = [];
                this.dadosGraficos = {};
                this.configuracoesGraficos = {};
                this.configuracaoSelecionada = {};
                this.graficoAtualConfiguracao = {};

                // Extrai o primeiro item de 'relatorios' do response data
                const relatorio = response.data.relatorios[0];
                // Se relatorio existir, define 'graficos' e 'configuracoes'
                if (relatorio) {
                    // Parsing dos dados JSON que vêm como strings
                    this.idComponenteDashboard = relatorio.id_componente;
                    this.configuracoesGraficos = JSON.parse(relatorio.configuracoes);
                    this.graficosNoDashboard = JSON.parse(relatorio.graficos);
                } else {
                    // Caso não exista dados no relatorio
                    this.idComponenteDashboard = null;
                    this.configuracoesGraficos = {};
                    this.graficosNoDashboard = [];
                }

                // Recarrega os dados de cada gráfico
                for (const grafico of this.graficosNoDashboard) {
                    await this.carregarDadosGrafico(grafico, grafico.id_componente);
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao carregar o dashboard.',
                    footer: error.message
                });
            }
        },
        adicionarGrafico(grafico) {
            const id_componente = Date.now();
            this.graficosNoDashboard.push({ ...grafico, id_componente });
            this.modalAberto = false;
            this.configuracoesGraficos[id_componente] = {}; // Inicializa as configurações do gráfico
            this.carregarDadosGrafico(grafico, id_componente);
        },
        async carregarDadosGrafico(grafico, id_componente) {
            try {
                const params = this.configuracoesGraficos[id_componente] || {};
                const response = await axios.get(grafico.endpoint, { params });
                this.dadosGraficos[id_componente] = response.data;
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao carregar dados do gráfico',
                    footer: error.message
                });
            }
        },
        toggleMenu(id_componente, event) {
            const menuRef = this.$refs['menu-' + id_componente];
            if (menuRef) {
                menuRef[0].toggle(event);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: `Menu com id 'menu-${id_componente}' não encontrado.`,
                    footer: error.message
                });
            }
        },
        getMenuItems(grafico) {
            return [
                {
                    label: 'Configurar',
                    icon: 'pi pi-fw pi-cog',
                    command: () => this.configurarGrafico(grafico)
                },
                {
                    label: 'Remover',
                    icon: 'pi pi-fw pi-trash',
                    command: () => this.removerGrafico(grafico.id_componente)
                }
            ];
        },
        configurarGrafico(grafico) {
            this.configuracaoSelecionada = { ...this.configuracoesGraficos[grafico.id_componente] };
            this.graficoAtualConfiguracao = grafico.id_componente;
            this.configuracaoModalAberto = true;
        },
        aplicarConfiguracao() {
            this.configuracoesGraficos[this.graficoAtualConfiguracao] = { ...this.configuracaoSelecionada };
            this.configuracaoModalAberto = false;
            this.carregarDadosGrafico(
                this.graficosNoDashboard.find((g) => g.id_componente === this.graficoAtualConfiguracao),
                this.graficoAtualConfiguracao
            );
        },
        aplicarConfiguracaoATodos() {
            this.graficosNoDashboard.forEach((grafico) => {
                this.configuracoesGraficos[grafico.id_componente] = { ...this.configuracaoSelecionada };
                this.carregarDadosGrafico(grafico, grafico.id_componente);
            });
            this.abrirPainelInferior = false;
        },
        removerGrafico(id_componente) {
            this.graficosNoDashboard = this.graficosNoDashboard.filter((g) => g.id_componente !== id_componente);
            delete this.dadosGraficos[id_componente]; // Remove os dados correspondentes do gráfico
            console.log(`Gráfico com id_componente ${id_componente} removido.`);
            Swal.fire({
                icon: 'success',
                title: 'Remoção de componente',
                text: `Gráfico com id_componente ${id_componente} removido.`
            });
        },
        async carregarOpcoes(url, retorno) {
            const response = await axios.get(`/api/relatorio/pedido/${url}`);
            this[retorno] = response.data;
        }
    },
    mounted() {
        this.graficosNoDashboard.forEach((grafico) => this.carregarDadosGrafico(grafico, grafico.id_componente));
        this.carregarOpcoes('status', 'opcoesStatus');
        this.carregarOpcoes('empresa', 'opcoesEmpresa');
        this.carregarOpcoes('representante', 'opcoesRepresentante');
        this.carregarDashboard();
    }
};
</script>
<style>
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}
.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(0px);
}
.fade-slide-enter-to {
    opacity: 1;
    transform: translateY(10px);
}
.fade-slide-leave-from {
    opacity: 1;
    transform: translateY(10px);
}
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(0px);
}
</style>