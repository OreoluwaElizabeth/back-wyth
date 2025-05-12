import axios from "axios";
import { useState } from "react";

const Smartphone = () => {
    const [input, setInput] = useState("");
    const [screenContent, setScreenContent] = useState("Welcome to the USSD Simulator. Tap to enter a code (e.g., *384#).");
    const [showKeypad, setShowKeypad] = useState(false);
    const [keypadMode, setKeypadMode] = useState("numbers");
    const [bgImage] = useState("https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0");

    const [sessionId] = useState(crypto.randomUUID());
    const [phoneNumber] = useState("254712345678");

    const BASE_URL = "https://backwyth-backend.onrender.com";
    const numberKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
    const letterKeys = ['', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ', '', '', ''];
    const handleKeyPress = (key) => {
        setInput(prev => prev + key);
    };
    const handleSend = async () => {
        if (!input) return;
        try {
            const response  = await axios.post(`${BASE_URL}/api/v1/user/userResponse/collect?`, {}, {
                params: {
                    sessionId,
                    serviceCode: input,
                    text: "",
                }
            });
            setScreenContent(response.data);
        } catch (error) {
            console.error("Error:", error);
            setScreenContent(error.response ? error.response.data : error.message);
        }
        setInput("");
        setShowKeypad(false);
    };

    const handleCancel = () => {
        setInput("");
        setShowKeypad(false);
    };

    const toggleKeypad = () => {
        if (!showKeypad) {
            setScreenContent("");
        }
        setShowKeypad(!showKeypad);
    };

    const toggleKeypadMode = () => {
        setKeypadMode(prev => prev === "numbers" ? "letters": "numbers");
    };
    const clearInput = () => {
        setInput("");
    };
    const backspace = () => {
        setInput(prev => prev.slice(0, -1));
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f0f0f0'
        }}>
            <div style={{
                width: '350px',
                height: '700px',
                backgroundColor: '#111',
                borderRadius: '40px',
                padding: '25px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '10px solid #333',
                boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                position: 'relative'
            }}>
                <div style={{
                    width: '180px',
                    height: '30px',
                    backgroundColor: '#111',
                    borderRadius: '0 0 25px 25px',
                    position: 'absolute',
                    top: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}></div>

                <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '28px',
                        color: 'white',
                        textShadow: '0 0 5px rgba(0,0,0,0.8)',
                        cursor: 'pointer',
                        padding: '20px',
                        overflowY: 'auto',
                        whiteSpace: 'pre-wrap'
                    }} onClick={toggleKeypad}>
                        {showKeypad && input ? input : screenContent}
                    </div>
                    {showKeypad && (
                        <div style={{
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            padding: '15px',
                            borderRadius: '15px 15px 0 0'
                        }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3,1fr)',
                                gap: '10px',
                                marginBottom: '10px'
                            }}>
                                {(keypadMode === "numbers" ? numberKeys : letterKeys).map((key, index) => (
                                    <div key={index} style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        color: 'white',
                                        borderRadius: '8px',
                                        padding: '12px 0',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '18px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }} onClick={() => keypadMode === "numbers" && handleKeyPress(numberKeys[index])}>
                                        {keypadMode === "numbers" ? numberKeys[index] : ''}
                                        {keypadMode === "letters" && (
                                            <span style={{ fontSize: '10px', marginTop: '3px' }}>{letterKeys[index]}</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '10px'
                            }}>
                                <button onClick={toggleKeypadMode} style={{
                                    padding: '8px',
                                    borderRadius: '20px',
                                    backgroundColor: 'rgba(255,255,255,0.3)',
                                    color: 'white',
                                    border: 'none',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    flex: 1,
                                    margin: '0 3px'
                                }}> {keypadMode === "numbers" ? "ABC" : "123"}</button>
                                <button onClick={clearInput} style={{
                                    padding: '8px',
                                    borderRadius: '20px',
                                    backgroundColor: 'rgba(255,255,255,0.3)',
                                    color: 'white',
                                    border: 'none',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    flex: 1,
                                    margin: '0 3px'
                                }}>Clear</button>
                                <button onClick={backspace} style={{
                                    padding: '8px',
                                    borderRadius: '20px',
                                    backgroundColor: 'rgba(255,255,255,0.3)',
                                    color: 'white',
                                    border: 'none',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    flex: 1,
                                    margin: '0 3px'
                                }}>⌫</button>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                <button onClick={handleCancel} style={{
                                    padding: '10px',
                                    borderRadius: '20px',
                                    backgroundColor: '#d33',
                                    color: 'white',
                                    border: 'none',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    flex: 1,
                                    margin: '0 3px'
                                }}>Cancel</button>
                                <button onClick={handleSend} disabled={!input} style={{
                                    padding: '10px',
                                    borderRadius: '20px',
                                    backgroundColor: '#3a3',
                                    color: 'white',
                                    border: 'none',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    flex: 1,
                                    margin: '0 3px',
                                    opacity: input ? 1 : 0.6
                                }}> Send</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Smartphone;