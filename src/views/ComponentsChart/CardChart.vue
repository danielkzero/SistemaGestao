<template>
    <div class="grid grid-cols-12 gap-4">
      <div
        v-for="grafico in graficosNoDashboard"
        :key="grafico.id"
        class="col-span-12 lg:col-span-6 xl:col-span-4"
      >
        <Card>
          <h3>{{ grafico.titulo }}</h3>
          <Chart v-if="grafico.tipo === 'bar'" :type="grafico.tipo" :data="getData(grafico.endpoint)" />
          <div v-else class="text-lg font-bold">{{ getData(grafico.endpoint) }}</div>
        </Card>
      </div>
    </div>
  </template>
  
  <script>
  import { Card } from 'primevue/card';
import { Chart } from 'primevue/chart';
  
  export default {
    components: { Chart, Card },
    methods: {
      getData(endpoint) {
        // Função para buscar dados do endpoint e formatar conforme necessário
      }
    }
  };
  </script>
  