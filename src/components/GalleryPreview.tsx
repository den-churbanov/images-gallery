import React, {useMemo, useState} from 'react'
import {GalleryImage} from '../utils/types'
import {Loader} from './Loader'
import {ImageAlert} from './ImageAlert'

interface GalleryPreviewProps {
    image: GalleryImage,
    deleteImage: (event: React.MouseEvent, idx: string) => void
}

export const GalleryPreview: React.FC<GalleryPreviewProps> = ({image, deleteImage}) => {
    const [loaded, setLoaded] = useState(false)
    const [fullscreen, setFullscreen] = useState(false)
    const imgStyle = useMemo(() => ({opacity: loaded ? 1 : 0}), [loaded])

    if (!image.styles.width) return null

    const toggleAlertHandler = () => {
        setFullscreen(!fullscreen)
    }
    const deleteImageHandler = (event: React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        deleteImage(event, image.idx)
    }

    return (
        <>
            <ImageAlert show={fullscreen} hideHandler={toggleAlertHandler}>
                <img className="alert_image_preview"
                     style={imgStyle}
                     src={image.url}
                     alt={image.idx}
                />
            </ImageAlert>
            <div className="preview_item" style={image.styles} onClick={toggleAlertHandler}>
                {!loaded && <Loader/>}
                <img className="preview_item__image"
                     style={imgStyle}
                     src={image.url}
                     alt={image.idx}
                     onLoad={() => setLoaded(true)}
                />
                <div className="preview_item__remove"
                     onClick={deleteImageHandler}>&times;</div>
            </div>
        </>
    )
}
