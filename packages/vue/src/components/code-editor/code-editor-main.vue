

<script lang="ts" setup>

import { ref, nextTick } from 'vue';
import { Extension } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
//import { linter, lintGutter } from '@codemirror/lint';
import { basicSetup } from 'codemirror';
import { indentWithTab } from '@codemirror/commands';
import { javascript } from "@codemirror/lang-javascript"
import { onMounted } from 'vue';



let emits = defineEmits< {
    (e:"save"):void
}>()


let view = ref<EditorView>();


function dummyKeymap() {
    return keymap.of([{
        key: "cmd-s",
        run() {
            emits('save');
            return true
        },
        preventDefault: true
    }])
}


const getExtensions = () => {
    let extensions: Extension[] = [
        basicSetup,
        javascript(),
        EditorView.theme({}, { dark: false }),
        EditorView.lineWrapping,
        dummyKeymap(),

        keymap.of([indentWithTab]),
    ]

    return extensions;
}

const init = async () => {
    view.value = new EditorView({
        doc: "",
        extensions: getExtensions(),
        parent: document.getElementById('editor') as Element,

    })

    await nextTick();

}

const getCurrentCM = () => {
    return view.value?.state.doc.toString();
}


const update = (source:string) => {

   let doc = view.value?.state.doc.toString() || "";

    view.value?.dispatch({
        changes: { from: 0, to: doc.length, insert: source }
    });
}

onMounted(() => {
    init();
})

defineExpose({
    update,
    getCurrentCM
})

</script>

<template>

    <div ref="editor" class="vue-codemirror" id="editor"></div>

</template>

<style lang="less" scoped>
.vue-codemirror {
    height: 0px;
    flex: 1;

    :deep(.cm-editor) {
        height: 100%;
    }

    :deep(.cm-line) {
        text-align: left;
    }

}
</style>