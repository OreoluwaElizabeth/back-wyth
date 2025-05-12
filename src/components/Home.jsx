import React, { useEffect } from "react";
import axios from "axios";

const Home = () => {
    const [display, setDisplay] = React.useState('0');
    const [mode, setMode] = React.useState('input');
    const [menuHistory, setMenuHistory] = React.useState([]);
    const [currentMenu, setCurrentMenu] = React.useState(null);

    const ussdMenus = {
        '*123#': {
            text: '1. Check Balance\n2. Buy Data\n3. Transfer',
            options: {
                '1': { text: 'Your balance is $50'},
                '2': { text: '1. 1GB - $5\n2. 5GB - $20'},
                '3': { text: 'Enter phone number'},
            }
        }
    };

    useEffect (() => {
        const fetchUssdMenus = async () => {
            try {
                const response = await axios.get('');
                setUssdMenus((prev) => ({ ...prev, ...response.data}));
            } catch (error) {
                console.error('Failed to fetch USSD menus:', error);
                setDisplay('Error fetching menu');
                setTimeout(() => {
                    setDisplay('0');
                    setMode('input');
                }, 1500);
            }
        };
        fetchUssdMenus();
    }, []);

    const appendNumber = (number) => {
        if (mode === 'input') {
            setDisplay((prev) => (prev === '0' ? number : prev + number));
        } else if (mode === 'menu' && currentMenu?.options[number]) {
            const selectedOption = currentMenu.options[number];
            setMenuHistory((prev) => [...prev, currentMenu]);
            setCurrentMenu(selectedOption);
            setDisplay(selectedOption.text);
        }
    };

    const handleUSSD = () => {
        if (ussdMenus[display]) {
            setMode('menu');
            setCurrentMenu(ussdMenus[display]);
            setMenuHistory([]);
            setDisplay(ussdMenus[display].text);
        } else {
            setDisplay('Invalid USSD Code');
            setTimeout(() => {
                setDisplay('0');
                setMode('input');
            }, 1500);
        }
    };

    const goBack = () => {
        if (menuHistory.length > 0) {
            const previousMenu = menuHistory[menuHistory.length - 1];
            setCurrentMenu(previousMenu);
            setDisplay(previousMenu.text);
            setMenuHistory((prev) => prev.slice(0, -1));
        } else {
            setMode('input');
            setDisplay('0');
            setCurrentMenu(null);
        }
    };

    const clearDisplay = () => {
        setDisplay('0');
        setMode('input');
        setMenuHistory([]);
        setCurrentMenu(null);
    };

    const handleKey = (key) => {
        if (key === '#') {
            handleUSSD();
        } else {
            appendNumber(key);
        }
    };

    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

    const styles = {
        phone: {
            background: '#374151',
            borderRadius: '15px',
            width: '220px',
            height: '380px',
            padding: '10px',
            boxShadow: '0 8px 15px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '2px solid #4b5563'
        },
        screen: {
            background: '#8b9e7b',
            height: '50px',
            width: '160px',
            margin: '15px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '8px',
            fontSize: '20px',
            color: '#000',
            border: '2px solid #1f2937',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.6)',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            fontFamily: '"VT323", monospace',
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.05) 50%, transparent 50%)',
            backgroundSize: '100% 4px'
        },
        navKeys: {
            display: 'flex',
            justifyContent: 'space-between',
            width: '160px',
            margin: '8px 0'
        },
        navKey: {
            background: '#1f2937',
            color: '#ffffff',
            padding: '8px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '12px',
            transition: 'background 0.2s, transform 0.1s',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        },
        navKeyHover: {
            background: '#4b5563'
        },
        navKeyActive: {
            transform: 'translateY(1px)',
            background: '#111827'
        },
        keypad: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '6px',
            width: '180px'
        },
        key: {
            background: '#1f2937',
            color: '#ffffff',
            padding: '12px',
            textAlign: 'center',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background 0.2s, transform 0.1s',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        },
        keyHover: {
            background: '#4b5563'
        },
        keyActive: {
            transform: 'translateY(1px)',
            background: '#111827'
        }
    };


    return (
        <div style={styles.phone}>
            <div style={styles.screen}>{display}</div>
                    <div style={styles.navKeys}>
                        <div
                            style={{
                                ...styles.navKey,
                                ...(mode === 'menu' && { cursor: 'pointer' })
                            }}
                            onClick={mode === 'menu' ? goBack : null}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.navKeyHover)}
                            onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.navKey)}
                            onMouseDown={(e) => Object.assign(e.currentTarget.style, styles.navKeyActive)}
                            onMouseUp={(e) => Object.assign(e.currentTarget.style, styles.navKey)}
                        >
                            {mode === 'menu' ? 'Back' : 'Menu'}
                        </div>
                        <div
                            style={styles.navKey}
                            onClick={clearDisplay}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.navKeyHover)}
                            onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.navKey)}
                            onMouseDown={(e) => Object.assign(e.currentTarget.style, styles.navKeyActive)}
                            onMouseUp={(e) => Object.assign(e.currentTarget.style, styles.navKey)}
                        >
                            Clear
                        </div>
                    </div>
                    <div style={styles.keypad}>
                        {keys.map((key) => (
                            <div
                                key={key}
                                style={styles.key}
                                onClick={() => handleKey(key)}
                                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.keyHover)}
                                onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.key)}
                                onMouseDown={(e) => Object.assign(e.currentTarget.style, styles.keyActive)}
                                onMouseUp={(e) => Object.assign(e.currentTarget.style, styles.key)}
                            >
                        {key}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home;