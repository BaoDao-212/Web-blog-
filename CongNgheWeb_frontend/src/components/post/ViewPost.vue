<script setup>
import { ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import 'vue-highlight-code/dist/style.css';
import CreateComment from '../comment/CreateComment.vue';
import ViewComment from '../comment/ViewComment.vue';
import to from '@/utils/awaitTo';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
// OR | AND
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
import { listComment } from '@/api/comment/index.ts';
import { Delta } from '@vueup/vue-quill';
import { usePostStore } from '@/stores/post';
import Storage from '@/utils/Storage';
import UpdatePost from '@/views/pages/post/UpdatePost.vue';
const { isDarkTheme } = useLayout();

const lineOptions = ref(null);
const showComment = ref(false);
const props = defineProps({
    content: {
        type: Object,
        require: true
    }
});
const comments = ref(props.content.comments);
const updateMessage = async () => {
    const data = await to(listComment({ postId: props.content.id }));
    comments.value = data[1].comments;
};
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
const images = ref(props.content.file);
const dateUpdate = Date.now() - new Date(props.content.createdAt).getTime();
const days = Math.floor(dateUpdate / (1000 * 60 * 60 * 24));
const remainingTime = dateUpdate % (1000 * 60 * 60 * 24);
const hours = Math.floor(remainingTime / (1000 * 60 * 60));
const remainingTimeMinutes = remainingTime % (1000 * 60 * 60);
const minutes = Math.floor(remainingTimeMinutes / (1000 * 60));
const timeString = `${days} ngày ${hours} giờ ${minutes} phút`;
const content = new Delta(props.content.content.ops);
const onDowload = (content) => {
    console.log(content);
    window.location.href = content;
};
// tùy chỉnh lưu lượng thả tym
const userData = Storage.get('INFO_ACCOUNT', null);
const post = usePostStore();
const numberTym = ref(props.content.userTym.length);
const isTym = ref(post.getTymPostId.includes(props.content.id) || props.content.userTym.map((user) => user.id).includes(userData.id));
const tymFunction = async () => {
    if (isTym.value) {
        numberTym.value -= 1;
        if (!props.content.userTym.map((user) => user.id).includes(userData.id)) await post.removeTymPostId(props.content.id);
        else await post.createTymPostId(props.content.id);
    } else {
        await post.createTymPostId(props.content.id);
        numberTym.value += 1;
    }
    isTym.value = !isTym.value;
};
console.log('heloo' + isTym.value);
</script>
<template>
    <div class="col-12">
        <Card class="w-full">
            <template #header>
                <Galleria :value="images" :responsiveOptions="responsiveOptions" :numVisible="5" containerStyle="max-width: 980px">
                    <template #item="slotProps">
                        <img v-if="slotProps.item.filePath.includes('.webp')" role="presentation" :src="slotProps.item.fileUrl" style="width: 100%" preview />
                        <video v-else-if="slotProps.item.filePath.includes('.mp4')" :src="slotProps.item.fileUrl" player="mp4" controls="true" style="width: 100%" />
                        <audio v-else-if="slotProps.item.filePath.includes('.mp3')" :src="slotProps.item.fileUrl" controls="true" width="300" />
                        <div v-else-if="slotProps.item.filePath.includes('.docx') || slotProps.item.filePath.includes('.pdf') || slotProps.item.filePath.includes('.pptx')">
                            <Button label="Link" link @click="onDowload(slotProps.item.fileUrl)">{{ slotProps.item.fileUrl }}</Button>
                        </div>
                    </template>
                    <template #thumbnail="slotProps" v-if="images.length > 1">
                        <img v-if="slotProps.item.filePath.includes('.webp')" role="presentation" :src="slotProps.item.fileUrl" class="w-4 h-4" />
                        <video v-else-if="slotProps.item.filePath.includes('.mp4')" role="presentation" :src="slotProps.item.fileUrl" player="mp4" controls="true" style="width: 12%" />
                        <audio v-else-if="slotProps.item.filePath.includes('.mp3')" role="presentation" :src="slotProps.item.fileUrl" controls="true" width="80" />
                        <div v-else-if="slotProps.item.filePath.includes('.docx') || slotProps.item.filePath.includes('.pdf') || slotProps.item.filePath.includes('.pptx')">
                            <Button label="Link" link altKey="true">{{ slotProps.item.fileUrl }}</Button>
                        </div>
                    </template>
                </Galleria>
            </template>
            <template #title>
                <div class="flex flex-row">
                    <Avatar :src="props.content.owner.avatar" v-if="props.content.owner.avatar" class="mr-2" size="large" shape="circle" />
                    <Avatar :src="props.content.owner.avatar" icon="pi pi-user" v-else class="mr-2" size="large" shape="circle" />
                    <div>
                        <div class="font-bold text-2xl font-light text-blue-700">{{ props.content.owner.name }}</div>
                        <div class="text-xs text-blue-600">{{ timeString }}</div>
                    </div>
                    <div v-if="props.content.userTags.length > 0" class="flex flex-row">
                        <span class="text-base text-blue-500 font-italic m-1">đã gắn thẻ</span>
                        <div v-for="tag in props.content.userTags" :key="tag.id" class="flex flex-row">
                            <div class="text-base text-blue-700 font-bold m-1">{{ tag.name }}</div>
                        </div>
                    </div>
                </div>
            </template>
            <template #content>
                <QuillEditor v-model:content="content" theme="bubble" readOnly="true" />
            </template>
            <template #footer>
                <div class="flex justify-content-between mb-2">
                    <div class="flex justify-content-start">
                        <Button icon="pi pi-heart" v-if="isTym" style="background-color: rgb(255, 131, 131)" severity="danger" @click="tymFunction" text raised rounded :label="numberTym + ' Tym'" />
                        <Button icon="pi pi-heart" v-else severity="danger" @click="tymFunction" text raised rounded :label="numberTym + ' Tym'" />
                        <Button @click="showComment = !showComment" icon="pi pi-book" :label="comments.length + ' Comment'" severity="info" text raised rounded style="margin-left: 0.5em" />
                    </div>
                    <UpdatePost :post="props.content" class="r-50" v-if="userData.id == props.content.owner.id" />
                </div>
                <CreateComment :postId="props.content.id" @update-message="updateMessage" />
                <div v-if="showComment">
                    <div v-for="comment in comments" :key="comment.owner">
                        <ViewComment :comment="comment" :ownerid="props.content.owner.id" @update-message="updateMessage" />
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>
<style lang="scss" scoped>
@import '@/assets/demo/styles/badges.scss';
@import '@/assets/demo/styles/items.scss';
</style>
