import React, {useCallback, useEffect, useRef, useState} from 'react'
import firebase from 'firebase'
import {GalleryPreview} from './GalleryPreview'
import {onEnteredHandlerType, onExitedHandlerType, UrlPreviewType} from '../utils/types'
import {Loader} from './Loader'
import {useAdaptiveImages} from '../hooks/images.adaptive.hook'
import {CSSTransition, TransitionGroup} from "react-transition-group";

type GalleryPropsType = {
    storage: firebase.storage.Storage
}

export const Gallery: React.FC<GalleryPropsType> = ({storage}) => {

    const [images, setImages] = useState<Array<UrlPreviewType>>([])
    const [loading, setLoading] = useState(false)
    const container = useRef<HTMLDivElement>(null)
    const {performanceImagesGrid, renderGridAfterDeleteImage} = useAdaptiveImages(container)

    const filesProcessor = async (itemRef: firebase.storage.Reference, idx: number) => {
        const {name, size} = await itemRef.getMetadata()
        const url = await itemRef.getDownloadURL()
        setImages(prevState => [...prevState, {
            url,
            name,
            size,
            idx
        }])
        if (!container.current) return
        performanceImagesGrid(container.current.childNodes)
    }

    useEffect(() => {
        const ref = storage.ref().child('images/')
        setLoading(true)
        ref.listAll()
            .then((res) => {
                res.items.forEach(filesProcessor)
            })
            .catch((error) => {
                alert(error)
            }).finally(() => setLoading(false))
    }, [])

    const deleteFile = useCallback((e: React.MouseEvent, url: string) => {
        const ref = storage.refFromURL(url)
        ref.delete()
            .then(() => {
                setImages(prevState => prevState.filter((image) => image.url !== url))
            })
            .catch((error) => {
                alert(error)
            })
    }, [storage])

    const onEnteredHandler: onEnteredHandlerType = () => {
        if (!container.current) return
        performanceImagesGrid(container.current.childNodes)
    }

    const onExitedHandler: onExitedHandlerType = (node) => {
        renderGridAfterDeleteImage((node.firstChild as HTMLImageElement).alt)
    }

    return (
        <div className="gallery_container">
            <div className="gallery_container__wrapper">
                {!images.length && !loading && <h4>Gallery is current empty</h4>}
                <div className="previews_container" ref={container}>
                    {!images.length && loading && <Loader/>}
                    <TransitionGroup component={null}>
                        {images.length && images.map((image, idx) =>
                            <CSSTransition key={image.idx}
                                           timeout={300}
                                           unmountOnExit={true}
                                           onEntered={onEnteredHandler}
                                           onExited={onExitedHandler}
                                           classNames="preview_item_animation">
                                <GalleryPreview key={image.idx} image={image} deleteFile={deleteFile}/>
                            </CSSTransition>
                        )}
                    </TransitionGroup>
                </div>
            </div>
        </div>
    )
}
