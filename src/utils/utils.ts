import {ImgData} from './types'

const readFile = (file: Blob) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (ev) => {
            resolve({
                file,
                url: ev.target!.result
            })
        }
        reader.onerror = reject;
        reader.readAsDataURL(file)
    })

export const readAllFiles = (files: FileList | Array<File>,
                             addImage: (image: ImgData) => void,
                             toggleLoading: () => void) => {
    if (files instanceof Object)
        files = Array.from(files)
    toggleLoading()
    let promises: Array<Promise<any>> = []
    files.forEach(file => {
        if (!file.type.match('image')) return
        promises.push(readFile(file))
    })
    promises.forEach(promise => {
        promise.then(data => {
            const img = new Image()
            img.onload = function () {
                addImage({
                    url: data.url,
                    height: img.naturalHeight,
                    width: img.naturalWidth
                })
            }
            img.src = data.url
        })
    })
    Promise.all(promises).then(_ => {
        toggleLoading()
    })
}

