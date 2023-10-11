import {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ThemeSwitcher = () => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleTheme = () => {
        setDarkMode((prev) => !prev);

        if (darkMode) {
            window.localStorage.setItem('theme', 'light');
        } else {
            window.localStorage.setItem('theme', 'dark');
        }
    };

    useEffect(() => {
        const html = document.querySelector('Html'),
            theme = window.localStorage.getItem('theme');

        if (theme === 'dark') {
            setDarkMode(true);
            html.classList.add('uk-dark');           
        } else {
            setDarkMode(false);
            html.classList.add('uk-light-demo');
            html.classList.remove('uk-dark');
        }
    }, [darkMode]);

    return (
        <div className="my_switcher">            
            <div className="wrap uk-overflow-hidden">
                <div className="darkmode-trigger uk-position-bottom-right uk-position-small uk-position-fixed uk-box-shadow-large uk-radius-circle" data-darkmode-toggle="">
                <label className="switch">
                    <span className="sr-only">Dark mode toggle</span>
                    <input data-theme="light"
                            className={`setColor light ${darkMode ? '' : 'active'}`}
                            onClick={() => toggleTheme()} type="checkbox" />
                    <span className="slider"></span>
                    <img className="uk-visible dark:uk-hidden" width="120" src="/images/moon.svg" alt="NFT Pawn Shop" loading="lazy" /> 
                    <img className="uk-hidden dark:uk-visible" width="120" src="/images/light.svg" alt="NFT Pawn Shop" loading="lazy" /> 
                </label>
            </div>
        </div>
        </div>
    );
};

export default ThemeSwitcher;
