<script setup>
import { onMounted, ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import 'vue-highlight-code/dist/style.css';
import { getInfo } from '@/api/account';
import { listpublicUserPost } from '@/api/post';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Error from '../auth/Error.vue';
const { isDarkTheme } = useLayout();
const lineOptions = ref(null);
const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);
const posts = ref([]);
const info = ref([]);
const route = useRoute();
console.log(route.params.id);
const check = ref(true);
const toast = useToast();
onMounted(async () => {
    const data = await listpublicUserPost({ userId: route.params.id });
    console.log(data);
    if (data.posts.length == 0) {
        check.value = false;
        toast.add({ severity: 'error', summary: 'Vui lòng thử lại sau', detail: 'Chưa có thông tin về người dùng này', life: 3000 });
        return;
    }
    if (data.ok) {
        posts.value = data.posts;
        info.value = data.posts[0].owner;
    }
});
onBeforeRouteUpdate(async (to, from, next) => {
    // Làm bất kỳ xử lý cần thiết để cập nhật component tại đây
    if (to.fullPath.split('/')[1] == 'postuser') {
        const data = await listpublicUserPost({ userId: to.fullPath.split('/')[2] });
        console.log(data);
        if (data.posts.length == 0) {
            check.value = false;
            toast.add({ severity: 'error', summary: 'Vui lòng thử lại sau', detail: 'Chưa có thông tin về người dùng này', life: 3000 });
            next();
            return;
        }
        check.value = true;
        if (data.ok) {
            posts.value = data.posts;
            info.value = data.posts[0].owner;
        }
    }
    next();
});
const first = ref(0);
</script>

<template>
    <Toast />
    <div v-if="check">
        <Card class="w-full">
            <template #header> </template>
            <template #title>
                <div class="flex flex-column justify-content-center">
                    <Image :src="info.avatar.filrUrl" v-if="info.avatar" alt="Image" width="250" />
                    <Image src="https://www.pngitem.com/pimgs/m/24-248235_user-profile-avatar-login-account-fa-user-circle.png" v-else alt="Image" width="250" />
                    <div class="ml-5">{{ info.name }}</div>
                </div>
            </template>
            <template #content>
                <div class="flex flex-row">
                    <div class="font-medium ml-5">Email: {{ info.email }}</div>
                </div>
            </template>
            <template #footer> </template>
        </Card>
        <div v-if="posts.length > 0" class="card">
            <div v-for="post in posts.slice(first, first + 6)" :key="post.content" class="col-12">
                <ViewPost :content="post" />
            </div>
            <Paginator v-model:first="first" :rows="6" :totalRecords="posts.length" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
        </div>
    </div>
    <Error v-else />
</template>
<style lang="scss" scoped>
@import '@/assets/demo/styles/badges.scss';
@import '@/assets/demo/styles/items.scss';
</style>
