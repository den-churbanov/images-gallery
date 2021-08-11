import React, {useCallback, useEffect, useRef, useState} from 'react'
import {
    onEnteredHandlerType,
    onExitedHandlerType,
    PreviewsType,
    UploaderProps
} from '../utils/types'
import {readAllFiles} from '../utils/utils'
import {UploaderPreview} from './UploaderPreview'
import {useAdaptiveImages} from '../hooks/images.adaptive.hook'
import {CSSTransition, TransitionGroup} from 'react-transition-group'
import {BaseTransitionProps} from "react-transition-group/Transition";

const acceptDefault = ['.png', '.jpg', 'jpeg', '.gif', ".json"]

export const FileUploader: React.FC<UploaderProps> = ({accept = acceptDefault, onUpload}) => {
    const [files, setFiles] = useState<Array<File>>([])
    const [previews, setPreviews] = useState<Array<PreviewsType>>([])
    const [loading, setLoading] = useState({
        state: false,
        count: 0
    })
    const [upload, setUpload] = useState(false)
    const [uploadProgress, setUploadProgress] = useState<Array<number>>([])
    const [dragEnter, setDragEnter] = useState(false)
    const fileInput = useRef<HTMLInputElement>(null)
    const urlInput = useRef<HTMLInputElement>(null)
    const uploadBtn = useRef<HTMLButtonElement>(null)
    const openBtn = useRef<HTMLButtonElement>(null)
    const container = useRef<HTMLDivElement>(null)

    const {performanceImagesGrid, renderGridAfterDeleteImage} = useAdaptiveImages(container)

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
            readAllFiles(event.target.files, setPreviews, startLoading, endLoading)
        }
    }

    const deleteFile = useCallback((event: React.MouseEvent<HTMLDivElement>, id: number) => {
        const newPreviews = previews.filter((_, idx) => idx !== id)
        const newFiles = files.filter((_, idx) => idx !== id)
        setPreviews(newPreviews)
        setFiles(newFiles)
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
        // readAllFiles(event.dataTransfer.files, startLoading, endLoading)
        setDragEnter(false)
    }

    function startLoading(length: number) {
        setLoading({
            state: true,
            count: length
        })
    }

    function endLoading() {
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

    const onEnteredHandler: onEnteredHandlerType = () => {
        if (!container.current) return
        performanceImagesGrid(container.current.childNodes)
    }

    const onExitedHandler: onExitedHandlerType = (node)=>{
        renderGridAfterDeleteImage((node.firstChild as HTMLImageElement).alt)
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
                            </>
                            :
                            loading.state ?
                                <span className="loading">
                                    {`File${loading.count > 1 ? 's are uploading' : ' is uploading'}...`}
                                </span> :
                                null
                        }
                        <div className="previews_container" ref={container}>
                            <TransitionGroup component={null}>
                                {previews.length && previews.map((image, idx) =>
                                    <CSSTransition key={image.idx}
                                                   timeout={300}
                                                   unmountOnExit={true}
                                                   onEntered={onEnteredHandler}
                                                   onExited={onExitedHandler}
                                                   classNames="preview_item_animation">
                                        <UploaderPreview buffer={image.buffer}
                                                         name={image.name}
                                                         size={image.size}
                                                         upload={upload}
                                                         progress={uploadProgress[idx]}
                                                         idx={idx}
                                                         key={image.idx}
                                                         deleteFile={deleteFile}/>
                                    </CSSTransition>
                                )}
                            </TransitionGroup>
                        </div>
                    </div>
            }
        </div>
    )
}