export function Gallery(container_s, item_s, img_s, marginRight = 0.01) {
    const breakpoints = [
        {
            point: 370,
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
    let container = document.querySelector(container_s)
    let CONTAINER_WIDTH = container && container.clientWidth
    let CURRENT_COUNT = 0

    let items = document.querySelectorAll(item_s)
    let images = document.querySelectorAll(img_s)

    function calculate() {
        CURRENT_COUNT = getCurrentCount()
        images = Array.from(images)
        items = Array.from(items)
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
        for (let i = 0; i < images.length; i++) {
            css(items[i], {
                margin: `0.5%`,
                width: `100%`
            })
        }
    }

    function twoColumns() {
        for (let i = 0; i < images.length; i += 2) {
            if (i + 1 === images.length) return
            twoGrid(images[i], images[i + 1], items[i], items[i + 1])
        }
    }

    function threeColumns() {
        for (let i = 0; i < images.length; i += 3) {
            if (i + 1 === images.length) return
            if (i + 3 >= images.length) {
                twoGrid(images[i], images[i + 1], items[i], items[i + 1])
                return
            }
            let k3 = CONTAINER_WIDTH / (images[i + 2].naturalWidth + (images[i + 2].naturalHeight / images[i].naturalHeight) * (images[i].naturalWidth + (images[i].naturalHeight / images[i + 1].naturalHeight) * images[i + 1].naturalWidth))
            let k1 = k3 * (images[i + 2].naturalHeight / images[i].naturalHeight)
            let k2 = k3 * (images[i + 2].naturalHeight / images[i + 1].naturalHeight)
            css(items[i], {
                width: `${(images[i].naturalWidth * k1 - CONTAINER_WIDTH * 0.01) / CONTAINER_WIDTH * 100}%`
            })
            css(items[i + 1], {
                width: `${(images[i + 1].naturalWidth * k2 - CONTAINER_WIDTH * 0.01) / CONTAINER_WIDTH * 100}%`
            })
            css(items[i + 2], {
                width: `${(images[i + 2].naturalWidth * k3 - CONTAINER_WIDTH * 0.01) / CONTAINER_WIDTH * 100}%`
            })
        }
    }

    function twoGrid(im1, im2, it1, it2) {
        let k1 = CONTAINER_WIDTH / (im1.naturalWidth + (im1.naturalHeight / im2.naturalHeight) * im2.naturalWidth)
        let k2 = k1 * (im1.naturalHeight / im2.naturalHeight)
        css(it1, {
            width: `${(im1.naturalWidth * k1 - CONTAINER_WIDTH * marginRight) / CONTAINER_WIDTH * 100}%`
        })
        css(it2, {
            width: `${(im2.naturalWidth * k2 - CONTAINER_WIDTH * marginRight) / CONTAINER_WIDTH * 100}%`
        })
    }

    function css(el, styles = {}) {
        Object.assign(el.style, styles)
    }

    function getCurrentCount() {
        for (const {
            point,
            count
        } of breakpoints) {
            if (CONTAINER_WIDTH < point) return count
        }
    }

    const bodyResizeHandler = (event) => {
        event.stopPropagation()
        const container = document.querySelector(container_s)
        CONTAINER_WIDTH = container && container.clientWidth
        calculate()
    }

    document.body.onresize = bodyResizeHandler

    return {
        perform() {
            calculate()
        },
        destroy() {
            document.body.onresize = null
        }
    }
}