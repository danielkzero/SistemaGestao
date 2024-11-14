<template>
    <div class="card p-4">
        <FullCalendar :events="events" :options="calendarOptions" />
    </div>
</template>

<script>
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import FullCalendar from '@fullcalendar/vue3';

export default {
    name: 'Agenda',
    components: {
        FullCalendar
    },
    data() {
        return {
            events: [
                {
                    id: '1',
                    title: 'Reunião de Planejamento',
                    start: '2024-11-01T10:00:00',
                    end: '2024-11-01T11:00:00'
                },
                {
                    id: '2',
                    title: 'Apresentação de Resultados',
                    start: '2024-11-02T14:00:00',
                    end: '2024-11-02T15:30:00'
                }
                // Adicione outros eventos aqui
            ],
            calendarOptions: {
                plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
                initialView: 'dayGridMonth', // Modos alternativos: 'timeGridWeek', 'timeGridDay'
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                editable: true,
                selectable: true,
                select: this.handleSelect,
                eventClick: this.handleEventClick
            }
        };
    },
    methods: {
        handleSelect(selectInfo) {
            // Lógica para quando uma nova seleção de data é feita
            const title = prompt('Insira o título do compromisso:');
            if (title) {
                const calendarApi = selectInfo.view.calendar;
                calendarApi.unselect(); // Limpa a seleção atual
                calendarApi.addEvent({
                    id: String(Math.random()),
                    title,
                    start: selectInfo.startStr,
                    end: selectInfo.endStr
                });
            }
        },
        handleEventClick(clickInfo) {
            // Exibe os detalhes do compromisso ou oferece opções para editar
            alert(`Evento: ${clickInfo.event.title}`);
        }
    }
};
</script>

<style scoped>
.p-4 {
    /* Ajuste de espaçamento ao redor do calendário */
}
</style>
