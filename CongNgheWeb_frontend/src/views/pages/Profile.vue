<script setup>
import { onMounted, ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import 'vue-highlight-code/dist/style.css';
import { getInfo } from '@/api/account';
import { listPostOfUser } from '@/api/post';
import Storage from '@/utils/Storage';
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
const info = ref(Storage.get('INFO_ACCOUNT', null));
onMounted(async () => {
    const data = await listPostOfUser();
    console.log(data);
    if (data.ok) {
        posts.value = data.posts;
    }
});
const first = ref(0);
</script>

<template>
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
</template>
<style lang="scss" scoped>
@import '@/assets/demo/styles/badges.scss';
@import '@/assets/demo/styles/items.scss';
</style>
