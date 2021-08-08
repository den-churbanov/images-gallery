import React from "react";

export type PreviewsType = {
    buffer: string,
    name: string,
    size: string,
    idx: number
}

export type UploaderProps = {
    accept?: Array<string>,
    onUpload: (files: Array<File>,
               showUploadProgress: (idx: number, progress: number) => void) => void
}

export type ImagePreviewPropsType = {
    buffer: string,
    name: string,
    size: string,
    idx: number,
    upload: boolean,
    progress: number,
    deleteFile: (event: React.MouseEvent<HTMLDivElement>, id: number) => void
}