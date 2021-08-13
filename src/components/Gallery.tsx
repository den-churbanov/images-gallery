import React, {useEffect, useRef} from 'react'
import {GalleryPreview} from './GalleryPreview'
import {
    GalleryFileImage,
    GalleryUrlImage,
    onEnteredHandlerType,
    onExitedHandlerType
} from '../utils/types'
import {useAdaptiveImages} from '../hooks/images.adaptive.hook'
import {CSSTransition, TransitionGroup} from 'react-transition-group'

interface GalleryProps {
    images: Array<GalleryUrlImage | GalleryFileImage>,
    deleteImage: (e: React.MouseEvent, id: string) => void
}

export const Gallery: React.FC<GalleryProps> = ({images, deleteImage}) => {
    const container = useRef<HTMLDivElement>(null)
    const {performanceImagesGrid, renderGridAfterDeleteImage} = useAdaptiveImages(container)

    const onEnteredHandler: onEnteredHandlerType = () => {
        if (!container.current) return
        performanceImagesGrid(container.current.childNodes)
    }

    useEffect(() => {
        if (container.current)
            performanceImagesGrid(container.current.childNodes)
    }, [container.current?.childNodes.length])

    const onExitedHandler: onExitedHandlerType = (node) => {
        renderGridAfterDeleteImage((node.firstChild as HTMLImageElement).alt)
    }

    console.log('Gallery rendered')
    return (
        <div className="gallery_container">
            <div className="gallery_container__wrapper">
                {!images.length && <h4>Gallery is current empty</h4>}
                <div className="previews_container" ref={container}>
                    <TransitionGroup component={null}>
                        {images.length && images.map((image, idx) =>
                            <CSSTransition key={image.idx}
                                           timeout={300}
                                           unmountOnExit={true}
                                           onEntered={onEnteredHandler}
                                           onExited={onExitedHandler}
                                           classNames="preview_item_animation">
                                <GalleryPreview key={image.idx} image={image} deleteImage={deleteImage}/>
                            </CSSTransition>
                        )}
                    </TransitionGroup>
                </div>
            </div>
        </div>
    )
}
