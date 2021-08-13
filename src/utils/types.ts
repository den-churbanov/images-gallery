export type JsonImage = {
    url: string,
    width: number,
    height: number
}

export type ImgData = {
    url?: string,
    width?: number,
    height?: number,
    buffer?: string
}

export type GalleryUrlImage = {
    idx: string,
    url: string,
    width?: number,
    height?: number
}

export type GalleryFileImage = {
    idx: string,
    buffer: string
}

export type onEnteredHandlerType = (node: HTMLElement, isAppearing: boolean) => void
export type onExitedHandlerType = (node: HTMLElement) => void
