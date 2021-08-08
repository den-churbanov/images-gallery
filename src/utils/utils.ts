import {PreviewsType} from './types'

const readFile = (file: Blob) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (ev) => {
            resolve({
                file,
                buffer: ev.target!.result
            })
        }
        reader.onerror = reject;
        reader.readAsDataURL(file)
    })

const bytesToSize = function (bytes: number) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (!bytes) return '0 Byte'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`
}

export const readAllFiles = (files: FileList | Array<File>,
                             startLoading: (length: number) => void,
                             endLoading: (previews: Array<PreviewsType>) => void) => {
    if (files instanceof Object)
        files = Array.from(files)
    startLoading(files.length)
    let promises: Array<Promise<any>> = []
    files.forEach(file => {
        if (!file.type.match('image')) return
        promises.push(readFile(file))
    })
    let previews: Array<PreviewsType> = []
    Promise.all(promises).then(readers => {
        readers.forEach((reader, idx) => {
            previews.push({
                buffer: reader.buffer,
                name: reader.file.name,
                size: bytesToSize(reader.file.size),
                idx
            })
        })
        endLoading(previews)
    })
}