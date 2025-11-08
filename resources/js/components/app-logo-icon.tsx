import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <>
            <div className="dark:flex hidden aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <img src='/logo-black.png' className="size-5 fill-current text-white dark:text-black" />
            </div>

            <div className="dark:hidden flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <img src='/logo-white.png' className="size-5 fill-current text-white dark:text-black" />
            </div>
        </>
    );
}
