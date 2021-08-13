import React, {useEffect, useState} from 'react'

/**
 * @name useAdaptiveImages
 * @version 1.1
 * @param ref - parent container which is limited in width (320-860px)
 * @param marginRight - margin after items of grid
 * @author Churbanov Denis <churbanov.dv@gmail.com>
 *
 * @description This hook takes a ref for a container that contains image wrapper elements.
 * It takes into account the initial dimensions of the images and, depending on their size and the width of the container,
 * forms a grid of images in which:
 * 1. The elements in each row are of the same height.
 * 2. The sum of the widths of all elements in each row (with margins) is equal to the width of the container.
 * IMPORTANT! The img tag must be the first child of the wrapper element.
 * IMPORTANT! The img tag must have an alt attribute.
 *
 * @return performanceImagesGrid - this function should be called every time the number of elements in the container has increased
 * @return renderGridAfterDeleteImage - this function should be called every time the
 * number of elements in the container has decreased.
 * The hook is called before React renders a new template, so the deleted element will remain
 * in the childNodes list of the container and the redrawing will be incorrect.
 * To avoid this, the function takes the deleted image as a parameter and deletes the DOM element with the alt attribute,
 * which is equal to the name of this image.
 */

export const useAdaptiveImages = (ref: React.RefObject<HTMLDivElement>, marginRight = 0.01) => {

    const [CONTAINER_WIDTH, setWidth] = useState(0)
    const [CURRENT_COUNT, setCount] = useState<number | undefined>(0)
    const [items, setItems] = useState<Array<ChildNode> | undefined>()

    const breakpoints = [
        {
            point: 320,
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
        if (!ref.current) return
        setItems(Array.from(ref.current.childNodes))
        document.body.onresize = onResizeBody
        return () => {
            document.body.onresize = null
        }
    }, [ref.current])

    const onResizeBody = () => {
        if (!ref.current) return
        setWidth(ref.current.clientWidth)
    }

    useEffect(() => {
        if (!ref.current) return
        setWidth(ref.current!.clientWidth)
    }, [ref.current?.clientWidth])

    useEffect(() => {
        calculate()
    }, [items?.length, CURRENT_COUNT])

    useEffect(() => {
        setCount(getCurrentCount())
    }, [CONTAINER_WIDTH])

    function calculate() {
        switch (CURRENT_COUNT) {
            case 1:
                oneColumn()
                break
            case 2:
                twoColumns()
                break
            case 3:
                threeColumns()
                break
        }
    }

    function oneColumn() {
        if (!items) return
        for (let i = 0; i < items.length; i++) {
            css(items[i].firstChild?.parentElement, {
                margin: `0.5%`,
                width: `100%`
            })
        }
    }

    function twoColumns() {
        if (!items) return
        for (let i = 0; i < items.length; i += 2) {
            const first = items[i]?.firstChild?.parentElement
            const second = items[i + 1]?.firstChild?.parentElement
            if (!second) twoGrid(first, first)
            twoGrid(first, second)
        }
    }

    function threeColumns() {
        if (!items) return
        for (let i = 0; i < items.length; i += 3) {
            const first = items[i]?.firstChild?.parentElement
            const second = items[i + 1]?.firstChild?.parentElement
            const third = items[i + 2]?.firstChild?.parentElement
            if (!second) return threeGrid(first)
            if (!third) return threeGrid(first, second)
            threeGrid(first, second, third)
        }
    }

    type ElementType = HTMLElement | null | undefined

    function twoGrid(it1: ElementType, it2: ElementType) {
        if (!CONTAINER_WIDTH || !it1 || !it2) return
        const im1 = it1.firstChild as HTMLImageElement
        const im2 = it2.firstChild as HTMLImageElement
        let k1 = CONTAINER_WIDTH / (im1.naturalWidth + (im1.naturalHeight / im2.naturalHeight) * im2.naturalWidth)
        let k2 = k1 * (im1.naturalHeight / im2.naturalHeight)
        css(it1, {
            width: `${(im1.naturalWidth * k1 - CONTAINER_WIDTH * marginRight) / CONTAINER_WIDTH * 100}%`
        })
        if (it1 !== it2)
            css(it2, {
                width: `${(im2.naturalWidth * k2 - CONTAINER_WIDTH * marginRight) / CONTAINER_WIDTH * 100}%`
            })
    }

    function threeGrid(it1: ElementType, it2?: ElementType, it3?: ElementType) {
        if (!CONTAINER_WIDTH || !it1) return
        if (!it2) return twoGrid(it1, it1)
        if (!it3) return twoGrid(it1, it2)
        const im1 = it1.firstChild as HTMLImageElement
        const im2 = it2.firstChild as HTMLImageElement
        const im3 = it3.firstChild as HTMLImageElement
        let k3 = CONTAINER_WIDTH / (im3.naturalWidth + (im3.naturalHeight / im1.naturalHeight) * (im1.naturalWidth + (im1.naturalHeight / im2.naturalHeight) * im2.naturalWidth))
        let k1 = k3 * (im3.naturalHeight / im1.naturalHeight)
        let k2 = k3 * (im3.naturalHeight / im2.naturalHeight)
        css(it1, {
            width: `${(im1.naturalWidth * k1 - CONTAINER_WIDTH * 0.01) / CONTAINER_WIDTH * 100}%`
        })
        css(it2, {
            width: `${(im2.naturalWidth * k2 - CONTAINER_WIDTH * 0.01) / CONTAINER_WIDTH * 100}%`
        })
        css(it3, {
            width: `${(im3.naturalWidth * k3 - CONTAINER_WIDTH * 0.01) / CONTAINER_WIDTH * 100}%`
        })
    }

    function css(el: HTMLElement | null | undefined, styles = {}) {
        if (el) Object.assign(el.style, styles)
        if (el) setTimeout(() => Object.assign(el.style,{maxWidth: 'unset', opacity: 1}), 200)
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

    const performanceImagesGrid = (items: NodeListOf<ChildNode> | Array<ChildNode> | undefined) => {
        if (items instanceof NodeList)
            setItems(Array.from(items))
        if (items instanceof Array)
            setItems(items)
        calculate()
    }

    const renderGridAfterDeleteImage = (name: string) => {
        if (!ref.current) return
        performanceImagesGrid(Array.from(ref.current.childNodes).filter(node =>
            (node.firstChild as HTMLImageElement).alt !== name
        ))
    }

    return {
        performanceImagesGrid,
        renderGridAfterDeleteImage
    }
}