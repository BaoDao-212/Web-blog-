<script setup>
import { onMounted, ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';
import { useUserStore } from '@/stores/user';
import to from '@/utils/awaitTo';

const model = ref([
    {
        label: 'Home',
        items: [
            { label: 'Home Page', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Create Blog', icon: 'pi pi-fw pi-upload', to: '/post/create' },
            { label: 'Personal Page', icon: 'pi pi-fw pi-user', to: '/account/profile' }
        ]
    }
]);

const userStore = useUserStore();
const autoValue = ref();
onMounted(async () => {
    const data = await to(userStore.getListUser());
    if (data[1]) {
        autoValue.value = data[1];
    } else {
        const dataListUser = await to(userStore.listUser());
        console.log(dataListUser);
        if (dataListUser[1]) {
            autoValue.value = dataListUser[1];
        }
    }
});
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
    <h2 class="text-blue-800">Other User</h2>
    <ul class="layout-menu">
        <div v-for="item in autoValue" :key="item">
            <router-link :to="`/postuser/${item.id}`">
                <div class="flex flex-row align-items-center m-1 border-1 border-blue-700 border-round">
                    <Avatar :src="item.avatar.fileUrl" v-if="item.avatar" class="mr-2" size="large" shape="circle" />
                    <Avatar icon="pi pi-user" v-else class="mr-2" shape="circle" />
                    <div class="font-bold font-light text-blue-700">{{ item.name }}</div>
                </div>
            </router-link>
        </div>
    </ul>
    <div></div>
</template>

<style lang="scss" scoped></style>
