import loader from "@monaco-editor/loader";
import * as monaco from "monaco-editor";

loader.config({
    'vs/nls': { availableLanguages: { '*': 'zh-cn' } },
})

export const codeProps = {
    modelValue: { type: String, default: '' },
    debounce: { type: Number, default: 500 },
    language: { type: String, default: 'go' },
    readonly: { type: Boolean, default: false },
    minimap: { type: Object },
    wordwrap: {
        type: String,
        default: 'off',
        validator(value) {
            return ['off', 'on', 'wordWrapColumn', 'bounded'].includes(value)
        },
    },
    readOnly: { type: Boolean, default: false },
    schemaUri: { type: String },
    tabSize: { type: Number, default: 2 },
    automaticLayout: { type: Boolean, default: true },
    scrollBeyondLastLine: { type: Boolean, default: false },
    contextmenu: { type: Boolean, default: false },
    accessibilityHelpUrl: { type: Boolean, default: false },
    folding: { type: Boolean, default: false },
    renderSideBySide: { type: Boolean, default: false },
    links: { type: Boolean, default: false },
    option: { type: Object, default: () => {} },
}

export const initEditor = async () => {
    loader.config({ monaco })

    const { editor, Uri } = await loader.init()

    return { editor, Uri}
}

export const debounce = (func, delay) => {
    let timer = null
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}
