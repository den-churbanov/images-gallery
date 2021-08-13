import React from 'react'
import {GalleryFileImage, GalleryUrlImage} from '../utils/types'

interface GalleryPreviewProps {
    image: GalleryUrlImage | GalleryFileImage,
    deleteImage: (event: React.MouseEvent, idx: string) => void
}

export const GalleryPreview: React.FC<GalleryPreviewProps> = ({image, deleteImage}) => {
    if ((image as GalleryUrlImage).url)
        return (
            <div className="preview_item">
                <img className="preview_item__image" src={(image as GalleryUrlImage).url} alt={image.idx}/>
                <div className="preview_item__remove"
                     onClick={event => deleteImage(event, image.idx)}>&times;</div>
            </div>
        )
    return (
        <div className="preview_item">
            <img className="preview_item__image" src={(image as GalleryFileImage).buffer} alt={image.idx}/>
            <div className="preview_item__remove"
                 onClick={event => deleteImage(event, image.idx)}>&times;</div>
        </div>
    )
}
