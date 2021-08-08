import React, {useEffect} from 'react'
import './styles/app.css'
import {FileUploader} from './components/FileUploader'
import {Gallery} from './components/Gallery'
import firebase from 'firebase'

/** server storage emulation
 * **/
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDPg-E7U6xRShibqH6ptMbCed_jercNfvQ",
    authDomain: "upload-files-9d7e9.firebaseapp.com",
    projectId: "upload-files-9d7e9",
    storageBucket: "upload-files-9d7e9.appspot.com",
    messagingSenderId: "247597627595",
    appId: "1:247597627595:web:9080a2f6ab6b87428b034e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const storage = firebase.storage()
/**
 * The upload function takes 3 parameters:
 * files - files to upload to the server,
 * showUploadProgress - a callback function that takes two parameters (file id and download percentage),
 * You can write your own server logic to load the data,
 * but it remains mandatory to call these two callback functions.
 * **/
function onUpload(files: Array<File>,
                  showUploadProgress: (idx: number, progress: number) => void) {
    files.forEach((file, idx) => {
        const ref = storage.ref(`images/${file.name}`)
        const task = ref.put(file);
        task.on('state_changed',
            snapshot => {
                const percentage = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                showUploadProgress(idx, percentage)
            }, error => {
                alert(error);
            })
    })
}

export const App: React.FC = () => {

    // useEffect(() => {
    //     const ref = storage.ref('./images/*')
    //     const task = ref.getDownloadURL().then(res=>console.log(res))
    //     // task.on('state_changed',
    //     //     snapshot => {
    //     //         const percentage = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
    //     //         showUploadProgress(idx, percentage)
    //     //     }, error => {
    //     //         alert(error);
    //     //     })
    // }, [])
    return (
        <div className="page_container">
            <h1 className="title">Gallery</h1>
            <FileUploader onUpload={onUpload}/>
            <Gallery/>
        </div>
    )
}




