import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react'
import {PreviewsType, UploaderProps} from '../utils/types'
import {readAllFiles} from '../utils/utils'
import {ImagePreview} from './ImagePreview'
import {Gallery as AdaptivePlugin} from '../utils/gallery-adaptive'

const acceptDefault = ['.png', '.jpg', 'jpeg', '.gif', ".json"]
type pluginType = {
    perform: () => void
    destroy: () => void
} | null
export const FileUploader: React.FC<UploaderProps> = ({accept = acceptDefault, onUpload}) => {
    const [files, setFiles] = useState<Array<File>>([])
    const [previews, setPreviews] = useState<Array<PreviewsType>>([])
    const [loading, setLoading] = useState({
        state: false,
        count: 0
    })
    const [perform, setPerform] = useState(false)
    const [upload, setUpload] = useState(false)
    const [uploadProgress, setUploadProgress] = useState<Array<number>>([])
    const [dragEnter, setDragEnter] = useState(false)
    const fileInput = useRef<HTMLInputElement>(null)
    const urlInput = useRef<HTMLInputElement>(null)
    const uploadBtn = useRef<HTMLButtonElement>(null)
    const openBtn = useRef<HTMLButtonElement>(null)
    let plugin: pluginType = null

    useLayoutEffect(() => {
        setPerform(prev=>!prev)
        plugin = AdaptivePlugin('.previews_container', '.preview_item', '.preview_item__image')
        plugin.perform()
    }, [loading, previews.length])

    useEffect(()=>{
        plugin&& plugin.perform()
    },[perform])

    useEffect(() => {
        let x = 0
        uploadProgress.map(i => x += i)
        if (openBtn.current)
            if (x === files.length * 100) {
                openBtn.current.disabled = false
            } else {
                if (!openBtn.current.disabled)
                    openBtn.current.disabled = true
            }
    }, [uploadProgress])

    const openBtnHandler = (event: React.MouseEvent) => {
        event.preventDefault()
        setFiles([])
        setPreviews([])
        setUpload(false)
        setUploadProgress(new Array(files.length).fill(0))
        if (uploadBtn.current) uploadBtn.current.disabled = false
        if (fileInput.current) fileInput.current.click()
    }

    const inputOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        if (event.target.files && event.target.files.length) {
            setFiles(Array.from(event.target.files))
            readAllFiles(event.target.files, startLoading, endLoading)
        }
    }

    const deleteFile = useCallback((event: React.MouseEvent<HTMLDivElement>, id: number) => {
        const preview = event.target.parentNode
        preview.classList.add('delete-animation')
        const newPreviews = previews.filter((_, idx) => idx !== id)
        const newFiles = files.filter((_, idx) => idx !== id)
        setTimeout(() => {
            setFiles(newFiles)
            preview.classList.remove('delete-animation')
            setPreviews(newPreviews)
            plugin&& plugin.perform()
        }, 300)
    }, [files, previews])

    //drag-and-drop handlers
    const dragEnterHandler = (event: React.DragEvent) => {
        event.preventDefault()
        setDragEnter(true)
    }
    const dragLeaveHandler = (event: React.DragEvent) => {
        event.preventDefault()
        setDragEnter(false)
    }
    const dropHandler = (event: React.DragEvent) => {
        event.preventDefault()
        readAllFiles(event.dataTransfer.files, startLoading, endLoading)
        setDragEnter(false)
    }

    function startLoading(length: number) {
        setLoading({
            state: true,
            count: length
        })
    }

    function endLoading(previews: Array<PreviewsType>) {
        setPreviews(previews)
        setLoading({
            state: false,
            count: 0
        })
    }

    const uploadFiles = () => {
        //call function to upload files
        onUpload(files, showUploadProgress)

        setUpload(true)
        //disable Upload Btn on Upload
        if (uploadBtn.current) uploadBtn.current.disabled = true
    }

    const showUploadProgress = (idx: number, progress: number) => {
        setUploadProgress(prevState => {
            let newState = prevState.slice()
            newState[idx] = progress
            return newState
        })
    }

    return (
        <div className="upload_card">
            {
                dragEnter ?
                    <div className="drop_area"
                         onDragEnter={dragEnterHandler}
                         onDragLeave={dragLeaveHandler}
                         onDragOver={dragEnterHandler}
                         onDrop={dropHandler}>
                        Drop files here
                    </div>
                    :
                    <div className="upload_card__wrapper"
                         onDragEnter={dragEnterHandler}
                         onDragLeave={dragLeaveHandler}
                         onDragOver={dragEnterHandler}>
                        <input type="file"
                               multiple={true}
                               accept={Array.isArray(accept) ? accept.join(',') : ''}
                               ref={fileInput}
                               onChange={inputOnChangeHandler}/>
                        <div className="input_form">
                            <input type="input"
                                   ref={urlInput}
                                   className="input_form__input"
                                   placeholder="Введите URL изображения"
                                   autoComplete="off"
                                   id="url" required/>
                            <label htmlFor="url"
                                   className="input_form__label">
                                Введите URL изображения
                            </label>
                        </div>
                        <button className="btn"
                                onClick={openBtnHandler}
                                ref={openBtn}>Open
                        </button>
                        {previews.length ?
                            <>
                                <button className="btn btn_primary"
                                        onClick={uploadFiles}
                                        ref={uploadBtn}>
                                    Upload
                                </button>
                                <div className="previews_container">
                                    {previews.map((file, idx) =>
                                        <ImagePreview buffer={file.buffer}
                                                      name={file.name}
                                                      size={file.size}
                                                      upload={upload}
                                                      progress={uploadProgress[idx]}
                                                      idx={idx}
                                                      key={idx + file.idx}
                                                      deleteFile={deleteFile}
                                        />
                                    )}
                                </div>
                            </>
                            :
                            loading.state ?
                                <span className="loading">
                                        {`File${loading.count > 1 ? 's are uploading' : ' is uploading'}...`}
                                    </span> :
                                null
                        }
                    </div>
            }
        </div>
    )
}