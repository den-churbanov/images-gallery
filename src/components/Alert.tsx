import React, {useEffect} from 'react'
import ReactDOM from 'react-dom'
import {CSSTransition} from 'react-transition-group'

interface IAlertParams {
    children?: React.ReactNode,
    show: boolean,
    header?: string,
    hideHandler: () => void
}

/***
 * Component renders modal window with children react node
 * @param children -
 * @param hideHandler -
 * @param header - possibly window header
 * @param show - **/
export const Alert = ({children, show, hideHandler, header}: IAlertParams) => {

    useEffect(() => {
        document.body.style.overflowY = show ? 'hidden' : 'scroll'
    }, [show])

    return ReactDOM.createPortal(
        <CSSTransition in={show}
                       timeout={500}
                       classNames="blur_window"
                       unmountOnExit>
            <div className="blur_window">
                <div className="message_block">
                    <div className={`message_block__header${!header ? ' cont_left' : ''}`}>
                        {header ? <p>{header}</p> : null}
                        <div className="bars is-active"
                             onClick={hideHandler}>
                            <span/>
                        </div>
                    </div>
                    <div className="message_block__content">
                        {children}
                    </div>
                </div>
            </div>
        </CSSTransition>,
        document.getElementById('modal')!
    )
}