<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item
                v-if="!item.separator"
                :item="item"
                :index="i"
            ></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<script>
import AppMenuItem from "./AppMenuItem.vue";

export default {
    components: {
        AppMenuItem,
    },
    data() {
        return {
            model: [
                {
                    label: "Início",
                    items: [
                        {
                            label: "Dashboard",
                            icon: "pi pi-fw pi-home",
                            to: "/",
                        },
                    ],
                },
                {
                    label: "Relatórios",
                    items: [
                        {
                            label: "Comercial",
                            icon: "pi pi-fw pi-bookmark",
                            items: [
                                {
                                    label: "Supervisores",
                                    icon: "pi pi-fw pi-bookmark",
                                    items: [
                                        {
                                            label: "Submenu 2.1.1",
                                            icon: "pi pi-fw pi-bookmark",
                                        },
                                        {
                                            label: "Submenu 2.1.2",
                                            icon: "pi pi-fw pi-bookmark",
                                        },
                                    ],
                                },
                                {
                                    label: "Representantes",
                                    icon: "pi pi-fw pi-bookmark",
                                    items: [
                                        {
                                            label: "Submenu 2.2.1",
                                            icon: "pi pi-fw pi-bookmark",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    label: "Informações do sistema",
                    items: [
                        {
                            label: "Documentação",
                            icon: "pi pi-fw pi-book",
                            to: "/documentation",
                        },
                        {
                            label: "View Source",
                            icon: "pi pi-fw pi-github",
                            url: "https://github.com/primefaces/sakai-vue",
                            target: "_blank",
                        },
                    ],
                },
            ],
        };
    },
};
</script>

<style lang="scss" scoped></style>
