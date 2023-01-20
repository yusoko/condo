import Icon from '@ant-design/icons'
import React from 'react'

interface ISberIcon {
    width?: number,
    height?: number,
}

export const SberIcon: React.FC<ISberIcon> = ({ width = 109, height = 17 }) => {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} fill='none'>
            <path fill='#21A038' d='M15.0027 3.274a8.4569 8.4569 0 011.0037 1.6751l-7.63 5.6575L5.1874 8.596V6.177l3.1888 2.0107 6.6264-4.9138z'/>
            <path fill='url(#paint0_linear)' d='M1.9351 8.4252c0-.1086.0027-.2164.008-.3236L.0104 8.0063A8.8928 8.8928 0 000 8.4271a8.4448 8.4448 0 00.6365 3.2233 8.406 8.406 0 001.817 2.7313l1.3708-1.3782a6.4582 6.4582 0 01-1.3989-2.0995 6.4889 6.4889 0 01-.4902-2.4788z'/>
            <path fill='url(#paint1_linear)' d='M8.3763 1.9456c.1079 0 .215.004.3216.0093L8.7946.0104a8.7692 8.7692 0 00-.4183-.01A8.3114 8.3114 0 005.17.6399a8.3508 8.3508 0 00-2.7169 1.8279L3.824 3.8465A6.4163 6.4163 0 015.9115 2.439a6.3862 6.3862 0 012.4648-.4934z'/>
            <path fill='url(#paint2_linear)' d='M8.376 14.9045c-.1078 0-.215 0-.3223-.0086l-.0967 1.9438c.139.0071.2787.0107.419.0107a8.307 8.307 0 003.2048-.6398 8.3462 8.3462 0 002.7152-1.8281l-1.3682-1.3781a6.42 6.42 0 01-2.0875 1.4068 6.388 6.388 0 01-2.4643.4933z'/>
            <path fill='url(#paint3_linear)' d='M12.0085 3.0765l1.6287-1.2074A8.3087 8.3087 0 008.375 0v1.9457a6.3824 6.3824 0 013.6335 1.1307z'/>
            <path fill='#21A038' d='M16.7518 8.4248a8.5288 8.5288 0 00-.1316-1.5098l-1.8029 1.3365v.1733a6.4937 6.4937 0 01-.5537 2.6278 6.4598 6.4598 0 01-1.5683 2.1742l1.3004 1.4457a8.4006 8.4006 0 002.0381-2.8292 8.444 8.444 0 00.718-3.4185z'/>
            <path fill='url(#paint4_linear)' d='M8.3754 14.9039a6.3962 6.3962 0 01-2.6128-.5572 6.4285 6.4285 0 01-2.162-1.5772l-1.4365 1.3074a8.3568 8.3568 0 002.8126 2.0504 8.3134 8.3134 0 003.3987.7224v-1.9458z'/>
            <path fill='url(#paint5_linear)' d='M4.0571 3.6229L2.7574 2.1772a8.4009 8.4009 0 00-2.0389 2.829A8.4443 8.4443 0 000 8.425h1.9352A6.495 6.495 0 012.489 5.797 6.4615 6.4615 0 014.057 3.623z'/>
            <path fill='#21A038' d='M48.3394 4.818l2.3967-1.756h-8.0213v10.5518h8.0213v-1.756h-5.7325V9.155h4.8901V7.399h-4.8901V4.818h3.3358zM37.3183 7.1728h-2.7848V4.8174h4.4445l2.3952-1.7612h-9.1271v10.5517h4.7777c2.6786 0 4.2158-1.2073 4.2158-3.3128 0-2.0143-1.3924-3.1223-3.9213-3.1223zm-.3976 4.6786h-2.3872V8.9276h2.3872c1.4488 0 2.1281.49 2.1281 1.4619s-.7228 1.4619-2.1281 1.4619zM56.6319 3.0606h-4.3663v10.5516h2.2885v-2.9891h2.0778c2.7857 0 4.5089-1.4577 4.5089-3.7869 0-2.3291-1.7232-3.7756-4.5089-3.7756zm-.0483 5.8053h-2.0295v-4.048h2.0295c1.4653 0 2.2739.7192 2.2739 2.0247 0 1.3056-.8086 2.0232-2.2739 2.0232zM28.8116 11.1222a4.0127 4.0127 0 01-1.9258.4793c-2.012 0-3.4717-1.4284-3.4717-3.3954s1.4597-3.3986 3.4717-3.3986a3.4152 3.4152 0 012.0278.6244l1.6008-1.1724-.1083-.0765c-.9338-.8165-2.1815-1.249-3.6097-1.249-1.5491 0-2.9538.5184-3.9567 1.4613a5.0955 5.0955 0 00-1.1782 1.7163 5.0711 5.0711 0 00-.3912 2.0414 5.2377 5.2377 0 00.3899 2.0641c.268.655.666 1.2495 1.1701 1.7482 1.0076.9804 2.4091 1.5205 3.9472 1.5205 1.6072 0 3.0119-.5573 3.963-1.572l-1.433-1.0616-.4959.27zM70.2172 7.1728h-2.7837V4.8174h5.9821V3.0562h-8.2711v10.5517h4.7716c2.6783 0 4.2157-1.2073 4.2157-3.3128.0063-2.0143-1.3858-3.1223-3.9146-3.1223zm-.3976 4.6786h-2.3861V8.9276h2.3861c1.4487 0 2.1276.49 2.1276 1.4619s-.7163 1.4619-2.1276 1.4619zM100.152 13.5928h-2.32V3.041h2.32v4.4318h1.263l3.41-4.4318h2.63l-4.045 5.0196 4.697 5.5322h-3.079l-3.452-4.15h-1.424v4.15zM82.5608 11.5872h-4.9081l-.832 2.049h-2.4691L78.955 3.0845h2.4686l4.5287 10.5517h-2.5594l-.8321-2.049zm-.7687-1.912l-1.6708-4.098-1.6802 4.098h3.351zM89.0759 3.0845v4.4062h4.8012V3.0845h2.3923v10.5517h-2.3923V9.4784h-4.8012v4.1578h-2.3923V3.0845h2.3923z'/>
            <defs>
                <linearGradient id='paint0_linear' x1='2.8448' x2='.7087' y1='14.1389' y2='7.9995' gradientUnits='userSpaceOnUse'>
                    <stop offset='.14' stopColor='#F1E813'/>
                    <stop offset='.3' stopColor='#E6E418'/>
                    <stop offset='.58' stopColor='#C9DA26'/>
                    <stop offset='.89' stopColor='#A2CC39'/>
                </linearGradient>
                <linearGradient id='paint1_linear' x1='3.0057' x2='8.4593' y1='2.8117' y2='.7455' gradientUnits='userSpaceOnUse'>
                    <stop offset='.06' stopColor='#0FA7DF'/>
                    <stop offset='.54' stopColor='#0098F8'/>
                    <stop offset='.92' stopColor='#0290EA'/>
                </linearGradient>
                <linearGradient id='paint2_linear' x1='7.8294' x2='13.9909' y1='15.676' y2='14.2921' gradientUnits='userSpaceOnUse'>
                    <stop offset='.12' stopColor='#A2CC39'/>
                    <stop offset='.28' stopColor='#86C239'/>
                    <stop offset='.87' stopColor='#219F38'/>
                </linearGradient>
                <linearGradient id='paint3_linear' x1='7.9725' x2='13.2425' y1='.6517' y2='2.2686' gradientUnits='userSpaceOnUse'>
                    <stop offset='.06' stopColor='#0290EA'/>
                    <stop offset='.79' stopColor='#0C89CA'/>
                </linearGradient>
                <linearGradient id='paint4_linear' x1='2.6495' x2='8.3881' y1='13.84' y2='15.9723' gradientUnits='userSpaceOnUse'>
                    <stop offset='.13' stopColor='#F1E813'/>
                    <stop offset='.3' stopColor='#EAE616'/>
                    <stop offset='.53' stopColor='#D8DF1F'/>
                    <stop offset='.8' stopColor='#BAD52D'/>
                    <stop offset='.98' stopColor='#A2CC39'/>
                </linearGradient>
                <linearGradient id='paint5_linear' x1='.7209' x2='3.0446' y1='8.6604' y2='2.6508' gradientUnits='userSpaceOnUse'>
                    <stop offset='.07' stopColor='#A2CC39'/>
                    <stop offset='.26' stopColor='#81C45E'/>
                    <stop offset='.92' stopColor='#0FA7DF'/>
                </linearGradient>
            </defs>
        </svg>
    )
}

const SberIconWithoutLabelSvg: React.FC<ISberIcon> = ({ width = 16, height = 16 }) => {
    return (
        <svg width={width} height={height} viewBox='0 0 21 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M18.6655 3.88562C19.1406 4.49979 19.5427 5.16704 19.8639 5.87396L10.7544 12.589L6.94727 10.2025V7.33145L10.7544 9.71792L18.6655 3.88562Z' fill='#1B7F8B'/>
            <path d='M3.0623 10C3.0623 9.8712 3.06545 9.74323 3.07173 9.61599L0.764519 9.50293C0.756666 9.66784 0.751956 9.83433 0.751956 10.0024C0.750974 11.3153 1.00922 12.6154 1.51188 13.8282C2.01454 15.041 2.75171 16.1427 3.68112 17.0699L5.31768 15.4342C4.60226 14.7217 4.03471 13.8748 3.64765 12.9422C3.2606 12.0096 3.06167 11.0097 3.0623 10Z' fill='#1B7F8B'/>
            <path d='M10.7513 2.30972C10.8801 2.30972 11.0081 2.31444 11.1353 2.32072L11.2507 0.0127628C11.0853 0.00490993 10.9188 0.000983979 10.7513 0.000983979C9.43779 -0.000617812 8.13695 0.257249 6.9234 0.759776C5.70984 1.2623 4.6075 1.9996 3.67969 2.92932L5.31625 4.56585C6.02882 3.8502 6.87583 3.28246 7.80858 2.89527C8.74133 2.50809 9.74138 2.30909 10.7513 2.30972Z' fill='#1B7F8B'/>
            <path d='M10.7522 17.69C10.6234 17.69 10.4954 17.69 10.3674 17.6798L10.252 19.987C10.4179 19.9953 10.5847 19.9996 10.7522 19.9996C12.0652 20.0009 13.3654 19.7429 14.5783 19.2402C15.7912 18.7375 16.8928 18.0001 17.8199 17.0704L16.1865 15.4347C15.4738 16.15 14.6269 16.7174 13.6943 17.1044C12.7617 17.4915 11.7619 17.6905 10.7522 17.69Z' fill='#1B7F8B'/>
            <path d='M15.0861 3.6516L17.0305 2.21845C15.2533 0.779379 13.0349 -0.0039947 10.748 1.53189e-05V2.30954C12.2966 2.30762 13.8092 2.77558 15.0861 3.6516Z' fill='#1B7F8B'/>
            <path d='M20.7512 10.0003C20.7524 9.39947 20.6999 8.7997 20.5941 8.20825L18.4416 9.79452C18.4416 9.86288 18.4416 9.93118 18.4416 10.0003C18.4422 11.0748 18.2169 12.1374 17.7805 13.1193C17.3441 14.1011 16.7062 14.9803 15.9082 15.6999L17.4608 17.4158C18.4982 16.4792 19.3272 15.3351 19.894 14.0577C20.4609 12.7802 20.7529 11.3979 20.7512 10.0003Z' fill='#1B7F8B'/>
            <path d='M10.7535 17.6904C9.67889 17.6908 8.61619 17.4655 7.63418 17.0291C6.65221 16.5927 5.77282 15.9549 5.05298 15.1571L3.33789 16.7088C4.27433 17.7464 5.41839 18.5755 6.69589 19.1425C7.97339 19.7094 9.35578 20.0016 10.7535 19.9999V17.6904Z' fill='#1B7F8B'/>
            <path d='M5.59569 4.30008L4.04394 2.58423C3.00622 3.52058 2.17691 4.6646 1.60978 5.94208C1.04267 7.21955 0.750407 8.60197 0.751959 9.99967H3.06231C3.06183 8.92524 3.28711 7.86261 3.72352 6.88075C4.15994 5.89892 4.79777 5.0197 5.59569 4.30008Z' fill='#1B7F8B'/>
        </svg>
    )
}

export const SberIconWithoutLabel: React.FC = (props) => {
    return (
        <Icon component={SberIconWithoutLabelSvg} {...props}/>
    )
}