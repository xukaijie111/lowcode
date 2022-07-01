

<script lang="ts" setup>

import { nextTick } from 'vue';
import { Extension } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
//import { linter, lintGutter } from '@codemirror/lint';
import { basicSetup } from 'codemirror';
import { indentWithTab } from '@codemirror/commands';
import { javascript } from "@codemirror/lang-javascript"
import { onMounted } from 'vue';



let emits = defineEmits<{
    (e: "dispatch", doc: string): void,
    (e: "save"): void
}>()


let view: EditorView; // 不能用ref定义，内部的值会被proxyed ,影响codemirror里面相关代码判断


function Keymap() {
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

        Keymap(),

        keymap.of([indentWithTab]),
    ]

    return extensions;
}

const init = async () => {
    view = new EditorView({
        doc: "",
        extensions: getExtensions(),
        parent: document.getElementById('editor') as Element,
        dispatch: ((tr) => {
            view?.update([tr])

            let doc = view.state.doc.toString();
            emits('dispatch', doc)

        })

    })

    await nextTick();

}




const update = (source: string) => {
    let doc = view.state.doc.toString() || "";
    view.dispatch({
        changes: { from: 0, to: doc.length, insert: source }
    });
}

onMounted(() => {
    init();
})

defineExpose({
    update
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