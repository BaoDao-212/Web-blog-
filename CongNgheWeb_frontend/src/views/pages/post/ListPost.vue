<script setup>
import { onMounted, ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import 'vue-highlight-code/dist/style.css';
import { usePostStore } from '@/stores/post';
import to from '@/utils/awaitTo';
const { isDarkTheme } = useLayout();
const usePost = usePostStore();
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
onMounted(async () => {
    const data = await to(usePost.listPublicPost());
    console.log(data);
    if (data[1].ok) {
        posts.value = data[1].posts;
    }
});
const first = ref(0);
</script>

<template>
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
