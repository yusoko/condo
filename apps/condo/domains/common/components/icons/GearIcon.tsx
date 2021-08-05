import React from 'react'
import Icon from '@ant-design/icons'

const GearIconSVG = ({ width = 20, height = 20, color = 'currentColor' }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.0112 8.1535c-.7007 0-1.357.2719-1.8539.7688-.4945.4968-.7687 1.1531-.7687 1.8539 0 .7008.2742 1.357.7687 1.8539.497.4945 1.1532.7687 1.8539.7687.7008 0 1.3571-.2742 1.8539-.7687.4946-.4969.7688-1.1531.7688-1.8539 0-.7008-.2742-1.357-.7688-1.854a2.5991 2.5991 0 00-1.8539-.7687zm9.6633 5.5195l-1.5328-1.3101c.0727-.4453.1102-.9.1102-1.3524 0-.4523-.0375-.9093-.1102-1.3523l1.5328-1.3102a.7504.7504 0 00.218-.825l-.0211-.0609a10.37 10.37 0 00-1.8656-3.2273l-.0422-.0492a.7527.7527 0 00-.8227-.2227l-1.9031.6773c-.7031-.5765-1.4859-1.0312-2.3344-1.3476l-.3679-1.9899a.7515.7515 0 00-.6047-.6023l-.0633-.0117c-1.2188-.2203-2.5031-.2203-3.7219 0l-.0633.0117a.7512.7512 0 00-.6047.6023L7.1073 3.302a8.2837 8.2837 0 00-2.318 1.343l-1.9171-.6821a.75.75 0 00-.8227.2227l-.0422.0492A10.4513 10.4513 0 00.1417 7.462l-.021.061a.7527.7527 0 00.2179.825L1.89 9.6723a8.2386 8.2386 0 00-.1078 1.3359c0 .45.0352.9.1079 1.3359l-1.547 1.3243a.7504.7504 0 00-.2179.825l.0211.0609c.4242 1.1789 1.05 2.2687 1.8656 3.2273l.0422.0493a.7524.7524 0 00.8227.2226l1.9172-.682c.6984.5742 1.4765 1.0289 2.318 1.343l.3702 1.9992a.7512.7512 0 00.6047.6023l.0633.0117a10.5063 10.5063 0 003.7219 0l.0633-.0117a.7512.7512 0 00.6046-.6023l.368-1.9899a8.2384 8.2384 0 002.3344-1.3476l1.9031.6773a.7505.7505 0 00.8227-.2226l.0422-.0493a10.4506 10.4506 0 001.8656-3.2273l.0211-.0609a.7567.7567 0 00-.2227-.8204zm-9.6633 1.2235c-2.2757 0-4.1203-1.8445-4.1203-4.1203 0-2.2758 1.8446-4.1203 4.1203-4.1203 2.2758 0 4.1204 1.8445 4.1204 4.1203 0 2.2758-1.8446 4.1203-4.1204 4.1203z" fill={color}/>
        </svg>
    )
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const GearIcon = (props) => {
    return <Icon component={GearIconSVG} {...props}/>
}