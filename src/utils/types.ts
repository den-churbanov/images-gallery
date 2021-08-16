export type ImgData = {
    url: string,
    width: number,
    height: number
}

export type GalleryImage = {
    idx: string,
    url: string,
    naturalWidth: number,
    naturalHeight: number,
    styles: {
        width?: string,
        marginRight?: string,
        maxWidth: string,
        opacity: number
    }

}

export type onEnteredHandlerType = (node: HTMLElement, isAppearing: boolean) => void
export type onExitedHandlerType = (node: HTMLElement) => void
