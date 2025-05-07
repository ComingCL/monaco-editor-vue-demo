<script setup>
import {onBeforeUnmount, ref, unref, watch} from "vue";
import {codeProps, debounce, initEditor} from "@/const.js";

const props = defineProps({
  diffValue: { type: String, default: ''}, // left text
  ...codeProps,
})

const emit = defineEmits(['input'])
const editorRef = ref()

let instance = null
let originalModel = null
let modifiedModel = null

const getValue = () => {
  return modifiedModel?.getValue()
}

const getDiffValue = () => {
  return originalModel?.getValue()
}

const setValue = value => {
  modifiedModel?.setValue(value)
}

const setDiffValue = value => {
  originalModel?.setValue(value)
}

const updateOptions = opt => {
  instance.updateOptions(opt)
}

const update = debounce(() => {
  const value = getValue()
  if (value !== props.modelValue) {
    emit('input', value)
  }
}, props.debounce)

watch(() => unref(editorRef), async value => {
  if (!value || instance) {
    return
  }
  const monacoEditor = await initEditor()

  const editorConfig = {
    readOnly: props.readOnly || props.readonly,
    tabSize: props.tabSize,
    automaticLayout: props.automaticLayout,
    scrollBeyondLastLine: props.scrollBeyondLastLine,
    theme: 'vs-dark',
    contextmenu: props.contextmenu,
    accessibilityHelpUrl: props.accessibilityHelpUrl,
    folding: props.folding,
    renderSideBySide: props.renderSideBySide,
    hideUnchangedRegions: {
      enabled: true,
      revealLineCount: 20,
      minimumLineCount: 1,
      contextLineCount: 1,
    },
    links: props.links,
    language: props.language,
    wordWrap: props.wordwrap,
    minimap: props.minimap,
    originalEditable: false,
    ...(props.option || {}),
  }

  const dom = unref(editorRef)

  const setModel = () => {
    instance = monacoEditor.editor.createDiffEditor(dom, editorConfig)

    originalModel = monacoEditor.editor.createModel(props.diffValue, props.language)
    modifiedModel = monacoEditor.editor.createModel(props.modelValue, props.language)

    instance.setModel({
      original: originalModel, // origin values, on the left
      modified: modifiedModel, // modified values, on the right
    })
  }

  setModel()

  instance.onDidUpdateDiff(event => {
    update()
  })

  instance.changeLanguage = value => {
    setModel()
  }
}, { immediate: true })

watch([() => props.readOnly], ([readOnly]) => {
  updateOptions({ readOnly })
})

watch(
    () => props.modelValue,
    value => {
      if (getValue() !== value) {
        setValue(value)
      }
    },
)
watch(
    () => props.diffValue,
    value => {
      if (getDiffValue() !== value) {
        setDiffValue(value)
      }
    },
)

watch(
    () => props.language,
    value => {
      instance.changeLanguage(value)
    },
)

watch(() => props.renderSideBySide,
value => {
  instance.updateOptions({ renderSideBySide: value })
})

onBeforeUnmount(() => {
  instance?.dispose()
  originalModel?.dispose()
  modifiedModel?.dispose()
  instance = null
})

defineExpose({
  setValue,
})
</script>

<template>
  <div ref="editorRef" class="border flex-1" style="background-color: #1e1e1e">
  </div>
</template>

<style></style>
