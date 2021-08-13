import React, {useRef, useState} from 'react'
import validator from 'validator'
import {
    ImgData,
    JsonImage,
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
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [url, setUrl] = useState('')
    const [dragEnter, setDragEnter] = useState(false)
    const fileInput = useRef<HTMLInputElement>(null)
    const openBtn = useRef<HTMLButtonElement>(null)
    const downloadBtn = useRef<HTMLButtonElement>(null)

    const {request} = useHttp()

    const openBtnHandler = (event: React.MouseEvent) => {
        event.preventDefault()
        if (fileInput.current)
            fileInput.current.click()
    }
    const downloadBtnHandler = async () => {
        if (!url) return
        if (validator.isURL(url)) {
            const response = await request(url)
            if (response && response.ok) {
                let data
                switch (response.headers.get('content-type')) {
                    case 'image/jpeg':
                        addImage({
                            url
                        })
                        setUrl('')
                        break
                    case 'application/json':
                        data = await response.json()
                        const images: Array<JsonImage> = data.galleryImages
                        images.forEach(image => {
                            addImage({
                                url: image.url
                            })
                        })
                }
            } else {
                setError('Unable to upload file')
            }
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
                                        ref={openBtn}>Open file
                                </button>
                            </div>
                            {loading && <span className="loading">Files are loading...</span>}
                        </div>
                }
            </div>
        </React.Fragment>

    )
}