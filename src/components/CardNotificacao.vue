<script>
export default {
    data() {
        return {
            items: [], // Placeholder para o menu (caso deseje adicionar opções)
            notifications: {
                today: [
                    {
                        icon: 'pi-dollar',
                        iconColor: 'blue',
                        user: 'Richard Jones',
                        action: 'comprou uma camiseta azul',
                        price: 'R$79,00'
                    },
                    {
                        icon: 'pi-download',
                        iconColor: 'orange',
                        text: 'Sua solicitação de saque no valor de R$2500,00 foi iniciada.'
                    }
                ],
                yesterday: [
                    {
                        icon: 'pi-dollar',
                        iconColor: 'blue',
                        user: 'Keyser Wick',
                        action: 'comprou uma jaqueta preta',
                        price: 'R$59,00'
                    },
                    {
                        icon: 'pi-question',
                        iconColor: 'pink',
                        user: 'Jane Davis',
                        action: 'postou uma nova pergunta sobre seu produto.'
                    }
                ],
                lastWeek: [
                    {
                        icon: 'pi-arrow-up',
                        iconColor: 'green',
                        text: 'Sua receita aumentou em 25%.'
                    },
                    {
                        icon: 'pi-heart',
                        iconColor: 'purple',
                        text: '12 usuários adicionaram seus produtos à lista de desejos.'
                    }
                ]
            }
        };
    }
};
</script>

<template>
    <div class="card">
        <div class="flex items-center justify-between mb-6">
            <div class="font-semibold text-xl">Notificações</div>
            <div>
                <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu1.toggle($event)"></Button>
                <Menu ref="menu1" :popup="true" :model="items" class="!min-w-40"></Menu>
            </div>
        </div>

        <span class="block text-muted-color font-medium mb-4">HOJE</span>
        <ul class="p-0 mx-0 mt-0 mb-6 list-none">
            <li v-for="(notification, index) in notifications.today" :key="'today' + index" class="flex items-center py-2 border-b border-surface">
                <div :class="`w-12 h-12 flex items-center justify-center bg-${notification.iconColor}-100 dark:bg-${notification.iconColor}-400/10 rounded-full mr-4 shrink-0`">
                    <i :class="`pi ${notification.icon} !text-xl text-${notification.iconColor}-500`"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal">
                    <span v-if="notification.user"
                        >{{ notification.user }}
                        <span class="text-surface-700 dark:text-surface-100"
                            >{{ notification.action }} por <span class="text-primary font-bold">{{ notification.price }}</span></span
                        ></span
                    >
                    <span v-else class="text-surface-700 dark:text-surface-100">{{ notification.text }}</span>
                </span>
            </li>
        </ul>

        <span class="block text-muted-color font-medium mb-4">ONTEM</span>
        <ul class="p-0 m-0 list-none mb-6">
            <li v-for="(notification, index) in notifications.yesterday" :key="'yesterday' + index" class="flex items-center py-2 border-b border-surface">
                <div :class="`w-12 h-12 flex items-center justify-center bg-${notification.iconColor}-100 dark:bg-${notification.iconColor}-400/10 rounded-full mr-4 shrink-0`">
                    <i :class="`pi ${notification.icon} !text-xl text-${notification.iconColor}-500`"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal">
                    <span v-if="notification.user"
                        >{{ notification.user }} <span class="text-surface-700 dark:text-surface-100">{{ notification.action }}</span></span
                    >
                    <span v-else class="text-surface-700 dark:text-surface-100">{{ notification.text }}</span>
                </span>
            </li>
        </ul>

        <span class="block text-muted-color font-medium mb-4">SEMANA PASSADA</span>
        <ul class="p-0 m-0 list-none">
            <li v-for="(notification, index) in notifications.lastWeek" :key="'lastWeek' + index" class="flex items-center py-2 border-b border-surface">
                <div :class="`w-12 h-12 flex items-center justify-center bg-${notification.iconColor}-100 dark:bg-${notification.iconColor}-400/10 rounded-full mr-4 shrink-0`">
                    <i :class="`pi ${notification.icon} !text-xl text-${notification.iconColor}-500`"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal">{{ notification.text }}</span>
            </li>
        </ul>
    </div>
</template>
