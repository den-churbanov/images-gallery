import React, {useEffect, useRef, useState} from 'react'
import validator from 'validator'
import {
    ImgData
} from '../utils/types'
import {readAllFiles} from '../utils/utils'
import {useHttp} from '../hooks/http.hook'
import {Alert} from './Alert'

const acceptDefault = ['.jpeg', '.jpg']

interface UploaderProps {
    addImage: (image: ImgData) => void,
    accept?: Array<string>
}

export const FileUploader: React.FC<UploaderProps> = ({accept = acceptDefault, addImage}) => {
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [url, setUrl] = useState('')
    const [dragEnter, setDragEnter] = useState(false)
    const fileInput = useRef<HTMLInputElement>(null)
    const openBtn = useRef<HTMLButtonElement>(null)
    const downloadBtn = useRef<HTMLButtonElement>(null)

    const {request, loading} = useHttp()

    const openBtnHandler = (event: React.MouseEvent) => {
        event.preventDefault()
        if (fileInput.current)
            fileInput.current.click()
    }

    const downloadBtnHandler = async () => {
        if (!url) return
        if (validator.isURL(url)) {
            const image = new Image()
            image.onload = function () {
                addImage({
                    url,
                    width: image.naturalWidth,
                    height: image.naturalHeight
                })
                setLoading(false)
            }
            image.onerror = async function () {
                const response = await request(url)
                if (response && response.ok) {
                    let data
                    if (response.headers.get('content-type') === 'application/json') {
                        data = await response.json()
                        const images: Array<ImgData> = data.galleryImages
                        images.forEach(image => {
                            addImage({
                                url: image.url,
                                width: image.width,
                                height: image.height
                            })
                        })
                    }
                } else {
                    setError('Unable to upload file')
                }
                setLoading(false)
            }
            image.src = url
            setLoading(true)
            setUrl('')
        } else {
            setError('URL is not valid')
        }
    }

    const fileInputOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        if (event.target.files && event.target.files.length) {
            readAllFiles(event.target.files, addImage, toggleLoading)
        }
    }
    const inputOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        setUrl(event.target.value)
    }

    const clearError = () => {
        setError(null)
    }
    const toggleLoading = () => setLoading(prevState => !prevState)

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
        readAllFiles(event.dataTransfer.files, addImage, toggleLoading)
        setDragEnter(false)
    }

    return (
        <React.Fragment>
            <Alert show={!!error} hideHandler={clearError}>
                <h5 className="alert_header">{error}</h5>
            </Alert>
            <div className="upload_card">
                {
                    dragEnter ?
                        <div className="drop_area"
                             onDragEnter={dragEnterHandler}
                             onDragLeave={dragLeaveHandler}
                             onDragOver={dragEnterHandler}
                             onDrop={dropHandler}>
                            <div className="drop_area__container">
                                Drop files here
                            </div>
                        </div>
                        :
                        <div className="upload_card__wrapper">
                            <div className="upload_card__content"
                                 onDragEnter={dragEnterHandler}
                                 onDragLeave={dragLeaveHandler}
                                 onDragOver={dragEnterHandler}>
                                <input type="file"
                                       multiple={true}
                                       accept={Array.isArray(accept) ? accept.join(',') : ''}
                                       ref={fileInput}
                                       onChange={fileInputOnChangeHandler}/>
                                <div className="input_form">
                                    <input type="input"
                                           className="input_form__input"
                                           placeholder="Enter image or JSON URL"
                                           autoComplete="off"
                                           value={url}
                                           onChange={inputOnChangeHandler}
                                           id="url" required/>
                                    <label htmlFor="url"
                                           className="input_form__label">
                                        Enter image or JSON URL
                                    </label>
                                </div>
                                <div className="btn_wrapper">
                                    <button className="btn btn_primary"
                                            onClick={downloadBtnHandler}
                                            ref={downloadBtn}>Download
                                    </button>
                                    <button className="btn"
                                            onClick={openBtnHandler}
                                            ref={openBtn}>Open files
                                    </button>
                                </div>
                                {(isLoading || loading) && <span className="loading">Files are loading...</span>}
                            </div>
                        </div>
                }
            </div>
        </React.Fragment>

    )
}