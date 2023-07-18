<script setup>
import { onMounted, ref, watch, reactive } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import 'vue-highlight-code/dist/style.css';
const { isDarkTheme } = useLayout();
const lineOptions = ref(null);
const userStore = useUserStore();
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
// chọn trạng thái cho bài viết
const dropdownItems = ref([State.Private, State.Public]);
// tìm kiếm người cần gắn thẻ
const autoValue = ref(null);
const selectedAutoValue = ref(null);
const autoFilteredValue = ref([]);

const router = useRouter();
const searchUser = (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            autoFilteredValue.value = [...autoValue.value];
        } else {
            autoFilteredValue.value = autoValue.value.filter((country) => {
                return country.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    }, 250);
};
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
//đăng ảnh lên
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import to from '@/utils/awaitTo';
import { useUserStore } from '@/stores/user';
import { usePostStore } from '@/stores/post';
import { updatePost } from '@/api/post';
import { useRouter } from 'vue-router';
const toast = useToast();
const totalSize = ref(0);
import { Delta, QuillEditor } from '@vueup/vue-quill';
import { State } from '@/utils/enum/enum';
const totalSizePercent = ref(0);
const files = ref([]);
const fileUploader = ref([]);
const uploadedFile = ref([]);
const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
    removeFileCallback(index);
    totalSize.value -= parseInt(formatSize(file.size));
    totalSizePercent.value = totalSize.value / 10;
};

const onSelectedFiles = (event) => {
    files.value = event.files.filter((f) => {
        if (fileUploader.value.length === 0) {
            return true;
        }
        return !fileUploader.value.includes(f);
    });
    files.value.forEach((file) => {
        totalSize.value += parseInt(formatSize(file.size));
    });
};

const uploadEvent = async () => {
    totalSizePercent.value = totalSize.value / 10;
    if (files.value && files.value.length > 0) {
        files.value.forEach(async (file) => {
            console.log(file);
            const formData = new FormData();
            formData.append('file', file);
            if (file.type == 'video/mp4') {
                formData.append('storagePath', 'video');
            } else {
                if (file.type == 'application/pdf') formData.append('storagePath', 'pdf');
                else if (file.type == 'audio/mpeg') formData.append('storagePath', 'mp3');
                else if (file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') formData.append('storagePath', 'docx');
                else formData.append('storagePath', 'image');
            }
            const res = await axios.post(import.meta.env.VITE_APP_BASE_API + 'upload/file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.data.code == 200) {
                uploadedFile.value.push(res.data.data.fileReference);
                formInline.file.push(res.data.data.fileReference);
                fileUploader.value = files.value.filter((f) => f === file);
                files.value = await files.value.filter((f) => f != file);
                toast.add({ severity: 'info', summary: 'Info', detail: file.name + '  upload thành công', life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: file.name + ' không thể upload được', life: 3000 });
            }
        });
    }
};

const onTemplatedUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};

const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
// tải bài viết lên
const formInline = reactive({
    postId: props.post.id,
    userTagsId: '',
    content: new Delta(props.post.content),
    limit: props.post.limit,
    file: props.post.file
});
console.log(formInline);
// fileUploader.value
const postBlog = async () => {
    formInline.userTagsId = searchUser.value ? selectedAutoValue.value.map((user) => user.id) : [];
    if (formInline.limit.trim() == '') {
        return toast.add({ severity: 'error', summary: 'Error', detail: 'Bạn cần chọn trang thái đăng tải cho  bài này', life: 3000 });
    }
    const data = await to(updatePost(formInline));
    console.log(data);
    if (data[1] && data[1].ok) toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    router.push('/');
};
selectedAutoValue.value = props.post.userTags;
const props = defineProps({
    post: {
        type: Object,
        require: true
    }
});
const visible = ref(false);
const removeFile = (file) => {
    formInline.file = formInline.file.filter((f) => f != file);
};
</script>

<template>
    <Button icon="pi pi-file-edit" @click="visible = !visible" outlined raised class="hover:shadow-5 ml-4" text></Button>
    <Dialog v-model:visible="visible" maximizable modal header="Update Post" :style="{ width: '100vw' }">
        <div class="card">
            <div class="p-fluid formgrid grid">
                <div class="card col-12">
                    <Toast />
                    <FileUpload name="demo[]" @upload="onTemplatedUpload($event)" :multiple="true" accept=".gif,.jpg,.jpeg,.mp4,.mp3,.docx,.pptx,.txt,.pdf" :maxFileSize="10000000" @select="onSelectedFiles">
                        <template #header="{ chooseCallback }">
                            <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
                                <Button @click="chooseCallback()" icon="pi pi-images" rounded outlined></Button>
                                <Button @click="uploadEvent()" icon="pi pi-cloud-upload" rounded outlined severity="success" :disabled="!files || files.length === 0"></Button>
                                <ProgressBar :value="totalSizePercent" :showValue="false" :class="['md:w-20rem h-1rem w-full md:ml-auto', { 'exceeded-progress-bar': totalSizePercent > 100 }]"
                                    ><span class="white-space-nowrap">{{ totalSize }}B / 100Mb</span></ProgressBar
                                >
                            </div>
                        </template>
                        <template #content="{ removeFileCallback }">
                            <div v-if="files && files.length > 0">
                                <h5>Pending</h5>
                                <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                                    <div v-for="(file, index) of files" :key="file" class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                                        <div v-if="file.type != 'video/mp4'">
                                            <div v-if="file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'">
                                                <i class="pi pi-file-word" style="font-size: 2.5rem"></i>
                                            </div>
                                            <div v-else-if="file.type == 'application/pdf'"><i class="pi pi-file-pdf" style="font-size: 2.5rem"></i></div>
                                            <div v-else-if="file.type == 'audio/mpeg'">
                                                <audio controls autoplay>
                                                    <source :src="file.objectURl" type="audio/mpeg" />
                                                </audio>
                                            </div>
                                            <img v-else role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" class="shadow-2" />
                                        </div>
                                        <video v-else-if="file.type == 'video/mp4'" :src="file.objectURl"></video>
                                        <div>{{ formatSize(file.size) }}</div>
                                        <Badge value="Pending" severity="warning" />
                                        <Button icon="pi pi-times" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" outlined rounded severity="danger" />
                                    </div>
                                </div>
                            </div>

                            <div v-if="formInline.file.length > 0">
                                <h5>Completed</h5>
                                <div class="flex flex-wrap p-0 gap-5">
                                    <div v-for="file of formInline.file" :key="file" class="card m-0 flex flex-column border-1 surface-border align-items-center">
                                        <div class="flex justify-content-end" @click="removeFile(file)">
                                            <Button icon="pi pi-times" style="color: rgb(210, 30, 30); background-color: aliceblue" text></Button>
                                        </div>
                                        <img v-if="file.filePath.includes('.webp')" role="presentation" :src="file.fileUrl" width="300" />
                                        <video v-else-if="file.filePath.includes('.mp4')" :src="file.fileUrl" player="mp4" controls="true" width="300" />
                                        <audio v-else-if="file.filePath.includes('.mp3')" :src="file.fileUrl" controls="true" width="300" />
                                        <div v-else-if="file.filePath.includes('.docx') || file.filePath.includes('.pdf') || file.filePath.includes('.pptx')">
                                            <Button label="Link" link>{{ file.fileUrl }}</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </FileUpload>
                </div>
                <div class="field col-12 mb-8">
                    <label for="content">Content</label>
                    <QuillEditor v-model:content="formInline.content" :modules="modules" toolbar="essential" />
                </div>
                <div class="field col-12 md:col-6 mt-2">
                    <label for="address">Tag Friends</label>
                    <AutoComplete placeholder="Search" id="dd" optionLabel="name" :dropdown="true" :multiple="true" v-model="selectedAutoValue" :suggestions="autoFilteredValue" @complete="searchUser($event)" field="name">
                        <template #option="slotProps">
                            <div class="flex align-options-center">
                                <Avatar v-if="!slotProps.option.avartar" icon="pi pi-user" />
                                <Avatar v-else :src="slotProps.option.avartar.fileUrl" />
                                <div class="flex flex-column">
                                    <div class="font-bold text-xl text-cyan-900">{{ slotProps.option.name }}</div>
                                    <div class="font-italic text-cyan-700">{{ slotProps.option.username }}</div>
                                </div>
                            </div>
                        </template>
                    </AutoComplete>
                </div>
                <div class="field col-12 md:col-6">
                    <label for="state">State blog</label>
                    <Dropdown id="state" v-model="formInline.limit" :options="dropdownItems" placeholder="Select One"></Dropdown>
                </div>
            </div>
            <div class="flex flex-row-reverse flex-wrap">
                <Button label="Update" icon="pi pi-upload" class="p-button-help" @click="postBlog()" />
            </div>
        </div>
    </Dialog>
</template>
<style></style>
