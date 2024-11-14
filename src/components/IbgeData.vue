<template>
    <div>
      <div class="mb-4">
        <label for="estado" class="font-bold">Selecione um Estado:</label>
        <select v-model="estadoSelecionado" @change="carregarEstatisticas">
          <option value="" disabled>Escolha um estado</option>
          <option v-for="estado in estados" :key="estado.id" :value="estado.id">
            {{ estado.nome }}
          </option>
        </select>
      </div>
  
      <div v-if="estatisticas">
        <h3 class="font-bold mb-2">Estatísticas para {{ estadoSelecionado }}</h3>
        <p><strong>População Total:</strong> {{ estatisticas.populacaoTotal }}</p>
        <p><strong>Área (km²):</strong> {{ estatisticas.area }}</p>
        <p><strong>Densidade Demográfica:</strong> {{ estatisticas.densidadeDemografica }} hab/km²</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        estados: [],
        estadoSelecionado: '',
        estatisticas: null,
      };
    },
    mounted() {
      this.carregarEstados();
    },
    methods: {
      async carregarEstados() {
        try {
          const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
          this.estados = response.data;
        } catch (error) {
          console.error('Erro ao carregar estados:', error);
        }
      },
      async carregarEstatisticas() {
        if (!this.estadoSelecionado) return;
  
        try {
          // Exemplo de endpoint fictício para dados demográficos, ajustar conforme documentação da API do IBGE
          const responsePopulacao = await axios.get(`https://servicodados.ibge.gov.br/api/v3/agregados/4714/periodos/2022/variaveis/93?localidades=N3[${this.estadoSelecionado}]`);
          console.log(responsePopulacao.data);
          const populacaoTotal = responsePopulacao.data[0]?.res[0].res || "Indisponível";
          
          const responseArea = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${this.estadoSelecionado}`);
          const area = responseArea.data.area || "Indisponível";
  
          // Calcule a densidade demográfica (população total / área)
          const densidadeDemografica = area && populacaoTotal ? (populacaoTotal / area).toFixed(2) : "Indisponível";
  
          this.estatisticas = {
            populacaoTotal,
            area,
            densidadeDemografica,
          };
        } catch (error) {
          console.error('Erro ao carregar estatísticas:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  select {
    padding: 8px;
    margin-top: 4px;
  }
  </style>
  