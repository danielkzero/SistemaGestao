<template>
        <div class="text-xs bg-slate-200 p-1 rounded" v-if="messageType === 'empresa' && configuracao?.empresa?.length" severity="info" icon="pi pi-building">
            {{ configuracao.empresa.map((id) => opcoesEmpresa.find((opcao) => opcao.value === id)?.label || 'Desconhecido').join(', ') }}
        </div>

        <div class="text-xs bg-orange-200 p-1 rounded" v-if="messageType === 'representante' && configuracao?.representante?.length" severity="success" icon="pi pi-user">
            {{ configuracao.representante.map((id) => opcoesRepresentante.find((opcao) => opcao.value === id)?.label || 'Desconhecido').join(', ') }}
        </div>

        <div class="text-xs bg-lime-200 p-1 rounded" v-if="messageType === 'periodo' && configuracao.periodo" severity="warning" icon="pi pi-calendar">
            {{ configuracao.periodo }}
            {{ configuracao.periodo == 1 ? 'mês' : 'meses' }}
        </div>

        <div class="text-xs bg-cyan-200 p-1 rounded" v-if="messageType === 'status' && configuracao?.status?.length" severity="info" icon="pi pi-check-circle">
            {{ configuracao.status.join(', ') }}
        </div>
</template>

<script>
export default {
    props: {
        messageType: String,
        configuracao: Object,
        opcoesEmpresa: Array,
        opcoesRepresentante: Array,
    },
    computed: {
        showMessage() {
            return this.configuracao && Object.keys(this.configuracao).length > 0;
        }
    }
};
</script>
<style scoped>
.p-message-text {
    font-size: 0.5rem !important;
}
</style>