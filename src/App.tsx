import React, {useCallback, useEffect, useState} from 'react'
import './styles/app.css'
import {v1 as uuid} from 'uuid'
import {GalleryFileImage, GalleryUrlImage, ImgData} from './utils/types'
import {FileUploader} from './components/FileUploader'
import {Gallery} from './components/Gallery'
import {getData} from './utils/defaultData'
import {Footer} from './components/Footer'

interface ResponseData  {
    galleryImages: Array<{
        url: string,
        width: number,
        height: number
    }>
}

export const App: React.FC = () => {
    const [images, setImages] = useState<Array<GalleryUrlImage | GalleryFileImage>>([])

    useEffect(() => {
        fetchDefaultData()
    }, [])

    async function fetchDefaultData() {
        const data: ResponseData = getData()
        const images = data.galleryImages.map(image => ({idx: uuid(), ...image}))
        setImages(images as Array<GalleryUrlImage | GalleryFileImage>)
    }

    const addImage = useCallback((data: ImgData) => {
        if (data.buffer) {
            setImages(prevState => [{
                idx: uuid(),
                buffer: data.buffer
            } as GalleryFileImage , ...prevState])
        }
        if (data.url) {
            setImages(prevState => [{
                idx: uuid(),
                url: data.url,
                width: data.width,
                height: data.height
            } as GalleryUrlImage , ...prevState])
        }
    }, [setImages])

    const deleteImage = useCallback((e: React.MouseEvent, id: string) => {
        const newImages = images.filter(image => image.idx !== id)
        setImages(newImages)
    }, [setImages, images])

    return (
        <div className="page_container">
            <h1 className="title">Gallery</h1>
            <FileUploader addImage={addImage}/>
            <Gallery images={images} deleteImage={deleteImage}/>
            <Footer/>
        </div>
    )
}




