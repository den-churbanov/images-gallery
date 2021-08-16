import React, {useEffect, useState} from 'react'
import {GalleryImage} from '../utils/types'

/**
 * @name useAdaptiveImages
 * @version 1.1
 * @param ref - parent container which is limited in width (320-860px)
 * @param images - state array of images
 * @param setImages - dispatch state images function
 * @param marginRight - margin after items of grid
 * @author Churbanov Denis <churbanov.dv@gmail.com>
 *
 * @description This hook takes a ref for a container that contains image wrapper elements.
 * It takes into account the initial dimensions of the images and, depending on their size and the width of the container,
 * forms a grid of images in which:
 * 1. The elements in each row are of the same height.
 * 2. The sum of the widths of all elements in each row (with margins) is equal to the width of the container.
 *
 * @return performanceImagesGrid - this function should be called every time the number of elements in the container has increased
 * @return renderGridAfterDeleteImage - this function should be called every time the
 * number of elements in the container has decreased, accepts a new array without a deleted element as a parameter.
 */

type styleType = {
    width: string,
    marginRight?: string
}

export const useAdaptiveImages = (ref: React.RefObject<HTMLDivElement>,
                                  images: Array<GalleryImage>,
                                  setImages: (images: Array<GalleryImage>) => void,
                                  margin = 0.01) => {
    const [CONTAINER_WIDTH, setWidth] = useState(0)
    const [CURRENT_COUNT, setCount] = useState<number | undefined>(0)
    const breakpoints = [
        {
            point: 330,
            count: 1,
        },
        {
            point: 576,
            count: 2,
        },
        {
            point: 810,
            count: 3,
        }
    ]

    useEffect(() => {
        // if (!ref.current) return
        document.body.onresize = onResizeBody
        return () => {
            document.body.onresize = null
        }
    }, [])

    const onResizeBody = () => {
        if (!ref.current) return
        setWidth(ref.current.clientWidth)
    }

    useEffect(() => {
        onResizeBody()
    }, [ref.current?.clientWidth])

    useEffect(() => {
        calculate()
    }, [CURRENT_COUNT])

    useEffect(() => {
        setCount(getCurrentCount())
    }, [CONTAINER_WIDTH])

    function calculate(imgs?: Array<GalleryImage>) {
        let items = imgs ? imgs : images;
        switch (CURRENT_COUNT) {
            case 1:
                oneColumn(items)
                break
            case 2:
                twoColumns(items)
                break
            case 3:
                threeColumns(items)
                break
        }
    }

    function oneColumn(images: Array<GalleryImage>) {
        const copyImages = getDeepCopy(images)
        for (let i = 0; i < copyImages.length; i++) {
            styles(copyImages[i], {
                width: `100%`
            })
        }
        setImages(copyImages)
    }

    function twoColumns(images: Array<GalleryImage>) {
        const copyImages = getDeepCopy(images)
        for (let i = 0; i < copyImages.length; i += 2) {
            const first = copyImages[i]
            const second = copyImages[i + 1]
            if (!second) twoGrid(first, first)
            twoGrid(first, second)
        }
        setImages(copyImages)
    }

    function threeColumns(images: Array<GalleryImage>) {
        const copyImages = getDeepCopy(images)
        for (let i = 0; i < copyImages.length; i += 3) {
            const first = copyImages[i]
            const second = copyImages[i + 1]
            const third = copyImages[i + 2]
            if (!second) threeGrid(first)
            if (!third) threeGrid(first, second)
            threeGrid(first, second, third)
        }
        setImages(copyImages)
    }

    function getDeepCopy(item: any) {
        return JSON.parse(JSON.stringify(item))
    }

    function twoGrid(image1: GalleryImage, image2: GalleryImage) {
        if (!CONTAINER_WIDTH || !image1 || !image2) return
        let k1 = CONTAINER_WIDTH / (image1.naturalWidth + (image1.naturalHeight / image2.naturalHeight) * image2.naturalWidth)
        let k2 = k1 * (image1.naturalHeight / image2.naturalHeight)
        styles(image1, {
            width: width(image1, k1)
        })
        if (image1 !== image2)
            styles(image2, {
                width: width(image2, k2)
            })
    }

    function threeGrid(image1: GalleryImage, image2?: GalleryImage, image3?: GalleryImage) {
        if (!CONTAINER_WIDTH || !image1) return
        if (!image2) return twoGrid(image1, image1)
        if (!image3) return twoGrid(image1, image2)
        let k3 = CONTAINER_WIDTH / (image3.naturalWidth + (image3.naturalHeight / image1.naturalHeight) * (image1.naturalWidth + (image1.naturalHeight / image2.naturalHeight) * image2.naturalWidth))
        let k1 = k3 * (image3.naturalHeight / image1.naturalHeight)
        let k2 = k3 * (image3.naturalHeight / image2.naturalHeight)
        styles(image1, {
            width: width(image1, k1)
        })
        // image1.styles.width = `${(image1.naturalWidth * k1 - CONTAINER_WIDTH * margin) / CONTAINER_WIDTH * 100}%`
        if (image1 !== image2)
            styles(image2, {
                width: width(image2, k2)
            })
            // image2.styles.width = `${(image2.naturalWidth * k2 - CONTAINER_WIDTH * margin) / CONTAINER_WIDTH * 100}%`
        if (image1 !== image3)
            styles(image3, {
                width: width(image3, k3)
            })
            // image3.styles.width = `${(image3.naturalWidth * k3 - CONTAINER_WIDTH * margin) / CONTAINER_WIDTH * 100}%`
    }

    function width(image: GalleryImage, k: number) {
        return `${(image.naturalWidth * k - CONTAINER_WIDTH * margin) / CONTAINER_WIDTH * 100}%`
    }

    function getCurrentCount() {
        if (!CONTAINER_WIDTH) return 0
        for (const {
            point,
            count
        } of breakpoints) {
            if (CONTAINER_WIDTH < point) return count
        }
    }

    function styles(image: GalleryImage, styles: styleType) {
        image.styles = {
            marginRight: `${margin * 100}%`,
            ...styles,
            maxWidth: 'unset',
            opacity: 1
        }
    }

    const performanceImagesGrid = () => {
        calculate()
    }

    const renderGridAfterDeleteImage = (images: Array<GalleryImage>) => {
        calculate(images)
    }

    return {
        performanceImagesGrid,
        renderGridAfterDeleteImage
    }
}