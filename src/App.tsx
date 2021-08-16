import React, {useCallback, useEffect, useState} from 'react'
import './styles/app.css'
import {v1 as uuid} from 'uuid'
import {GalleryImage, ImgData} from './utils/types'
import {FileUploader} from './components/FileUploader'
import {Gallery} from './components/Gallery'
import {getData} from './utils/defaultData'
import {Footer} from './components/Footer'

interface ResponseData {
    galleryImages: Array<ImgData>
}

export const App: React.FC = () => {
    const [images, setImages] = useState<Array<GalleryImage>>([])

    useEffect(() => {
        getDefaultData()
    }, [])

    const parseDataToGalleryImage = (data: ImgData): GalleryImage =>
        ({
            idx: uuid(),
            url: data.url,
            naturalWidth: data.width,
            naturalHeight: data.height,
            styles: {
                marginRight: '',
                width: '',
                maxWidth: 'unset',
                opacity: 1
            }
        })

    function getDefaultData() {
        const data: ResponseData = getData()
        if (data && data.galleryImages){
            const images = data.galleryImages.map(parseDataToGalleryImage)
            setImages(images)
        }
    }

    const addImage = useCallback((data: ImgData) => {
        setImages(prevState => [parseDataToGalleryImage(data), ...prevState])
    }, [setImages])

    const deleteImage = useCallback((e: React.MouseEvent, id: string) => {
        const newImages = images.filter(image => image.idx !== id)
        setImages(newImages)
    }, [setImages, images])

    const setUpdatedImages = (images: Array<GalleryImage>) => {
        setImages(images)
    }

    return (
        <div className="page_container">
            <h1 className="title">Gallery</h1>
            <FileUploader addImage={addImage}/>
            <Gallery images={images} setImages={setUpdatedImages} deleteImage={deleteImage}/>
            <Footer/>
        </div>
    )
}




