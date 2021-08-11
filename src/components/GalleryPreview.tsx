import React from 'react'
import {UrlPreviewType} from '../utils/types'
import {bytesToSize} from '../utils/utils'

type GalleryPreviewProps = {
    image: UrlPreviewType,
    deleteFile: (event: React.MouseEvent, url: string) => void
}

export const GalleryPreview: React.FC<GalleryPreviewProps> = ({image, deleteFile}) => {
    return (
        <div className="preview_item">
            <img className="preview_item__image" src={image.url} alt={image.name}/>
            <div className="preview_item__remove"
                 onClick={event => deleteFile(event, image.url)}>&times;</div>
            <div className="preview_item__info">
                <span>{image.name}</span>
                <span>{bytesToSize(image.size)}</span>
            </div>
        </div>
    )
}