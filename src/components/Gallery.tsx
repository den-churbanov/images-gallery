import React, {useRef} from 'react'
import {GalleryPreview} from './GalleryPreview'
import {
    GalleryImage,
    onEnteredHandlerType,
    onExitedHandlerType
} from '../utils/types'
import {useAdaptiveImages} from '../hooks/images.adaptive.hook'
import {CSSTransition, TransitionGroup} from 'react-transition-group'

interface GalleryProps {
    images: Array<GalleryImage>,
    setImages: (images: Array<GalleryImage>) => void,
    deleteImage: (e: React.MouseEvent, id: string) => void
}

export const Gallery: React.FC<GalleryProps> = ({images, setImages, deleteImage}) => {
    const container = useRef<HTMLDivElement>(null)

    const {performanceImagesGrid, renderGridAfterDeleteImage} = useAdaptiveImages(container, images, setImages)

    const onEnteredHandler: onEnteredHandlerType = () => {
        performanceImagesGrid()
    }

    const onExitedHandler: onExitedHandlerType = function (this: { idx: string }) {
        renderGridAfterDeleteImage(images.filter(image => image.idx !== this.idx))
    }

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
                                           onExited={onExitedHandler.bind({idx: image.idx})}
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
