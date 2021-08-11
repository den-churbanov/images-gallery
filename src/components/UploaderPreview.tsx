import React, {useEffect, useState} from 'react'
import {ImagePreviewPropsType} from '../utils/types'

type ImagePreviewType = {
    buffer: string,
    name: string,
    size: string,
    idx: number
} | null

export const UploaderPreview: React.FC<ImagePreviewPropsType> = ({
                                                                  buffer,
                                                                  name,
                                                                  size,
                                                                  idx,
                                                                  upload,
                                                                  progress,
                                                                  deleteFile
                                                              }) => {
    const [image, setImage] = useState<ImagePreviewType>(null)

    useEffect(() => {
        setImage({
            buffer,
            name,
            size,
            idx
        })
    }, [buffer, setImage])

    if (!image) return null
    return (
        <div className="preview_item">
            <img className="preview_item__image" src={image.buffer} alt={image.name}/>
            {
                !upload &&
                <div className="preview_item__remove"
                     onClick={event => deleteFile(event, idx)}>&times;</div>
            }
            {
                upload ?
                    <div className="preview_item__info preview_item__info_upload">
                        <div className="preview-info-progress" style={{width: progress + '%'}}>
                            <span>{progress === 100 ? 'Загружено' : progress + '%'}</span>
                        </div>
                    </div>
                    :
                    <div className="preview_item__info">
                        <span>{image.name}</span>
                        <span>{image.size}</span>
                    </div>
            }
        </div>
    )
}
