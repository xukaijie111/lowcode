

<script lang="ts" setup>

import { ref } from 'vue';
import { EditorSelection, EditorState, StateEffect,Extension ,Transaction} from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { linter, lintGutter } from '@codemirror/lint';
import { basicSetup, minimalSetup } from 'codemirror';
import { indentWithTab,defaultKeymap } from '@codemirror/commands';
import {javascript} from "@codemirror/lang-javascript"
import { onMounted } from 'vue';
import type {Node} from '@antv/x6'

type MapValue = {
    node:Node,
    data:Record<any,any>
}

let state = ref<EditorState>();
let view = ref<EditorView>();

let cacheMap = new Map<string,MapValue>()

function dummyKeymap() {
  return keymap.of([{
    key: "cmd-s",
    run() {
         console.log(111)
         return true 
    },
    preventDefault:true
  }])
}

const getExtensions = () => {
    let extensions : Extension[] = [
        basicSetup,
        javascript(),
        EditorView.theme({},{dark:false}),
        EditorView.lineWrapping,
        dummyKeymap(),
        keymap.of([indentWithTab]) 
    ]

    return extensions;
}

const init = () => {
    view.value = new EditorView({
        doc: "Hello World",
        extensions: getExtensions(),
        parent: document.getElementById('editor') as Element,
       
    })

}

const update = (node:Node) => {
    let id = node.id;
    let exit = cacheMap.get(id);
    if (!exit) {
        exit = { node,data:node.getData()}
        cacheMap.set(id,exit)
    }

    let source = exit.data.code.source;

    view.value?.dispatch({
        changes: { from: 0, to: source.length, insert: source }
      });
}

onMounted(()=>{
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
.vue-codemirror{
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