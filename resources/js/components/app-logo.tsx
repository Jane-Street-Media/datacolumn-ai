import AppLogoIcon from './app-logo-icon';

export default function AppLogo({ showText = true}) {
    return (
        <>
            <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            {showText && <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold"> DataColumn<span className="">.ai</span> </span>
            </div>}
        </>
    );
}
