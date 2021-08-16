import React from 'react'
import {Icon} from './svg-icons/Icon'
import SVG from './svg-icons/social-icons-sprite.svg'

/**
 * for support svg import put into ./src/@types/assets/index.d.ts next declaration:
 declare module "\*.svg" {
      import React = require("react");
      export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
      const src: string;
      export default src;
  }
 * Otherwise, add the react-app-env.d.ts file on the ./src directory with the following contents:
 * /// <reference types="react-scripts" />
 * more: https://duncanleung.com/typescript-module-declearation-svg-img-assets/
**/

type SocialLink = {
    href: string,
    className: string,
    iName: string
}

export const Footer = () => {
    const links: Array<SocialLink> =
        [CLink('tel:+79278988843', 'phone-icon', 'phone'),
            CLink('mailto:churbanov.dv@gmail.com', 'gmail-icon', 'gmail'),
            CLink('https://t.me/den_churbanov', 'tg-icon', 'tg'),
            CLink('https://vk.com/den_churbanov', 'vk-icon', 'vk'),
            CLink('https://instagram.com/den_churbanov', 'ig-icon', 'ig'),
            CLink('https://www.linkedin.com/in/denchurbanov', 'linkedin-icon', 'linkedin')
        ]

    function CLink(href: string, className: string, iName: string) {
        return {
            href,
            className,
            iName
        }
    }

    return (
        <footer className="footer">
            <div className="social__column">
                <span>Contact me:</span>
                <ul className="social-menu">
                    {links.map((link, idx) => {
                        return (
                            <li key={idx}>
                                <a href={link.href}
                                   className={link.className}
                                   target="_blank"
                                   rel="noopener noreferrer">
                                    <Icon name={link.iName}
                                          className="social-icon"
                                          file={SVG}/>
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </footer>
    )
}