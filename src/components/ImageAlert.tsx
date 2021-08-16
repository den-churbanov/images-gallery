import React, {useEffect} from 'react'
import ReactDOM from 'react-dom'
import {CSSTransition} from 'react-transition-group'
import {IAlertParams} from './Alert'

/***
 * Component renders modal window with children react node
 * @param children -
 * @param hideHandler -
 * @param header - possibly window header
 * @param show - **/
export const ImageAlert = ({children, show, hideHandler}: IAlertParams) => {

    useEffect(() => {
        document.body.style.overflowY = show ? 'hidden' : 'scroll'
    }, [show])

    return ReactDOM.createPortal(
        <CSSTransition in={show}
                       timeout={300}
                       classNames="_alert_image_blur"
                       unmountOnExit>
            <div className="alert__blur_window">
                <div className="bars is-active _alert_image_bars"
                     onClick={hideHandler}>
                    <span/>
                </div>
                <CSSTransition in={show}
                               timeout={1000}
                               classNames="alert_image_preview"
                               unmountOnExit>
                    {children}
                </CSSTransition>
            </div>
        </CSSTransition>,
        document.getElementById('modal')!
    )
}