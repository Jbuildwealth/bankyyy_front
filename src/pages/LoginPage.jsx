// src/pages/LoginPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/Card.jsx';
import { Alert, AlertTitle, AlertDescription } from '../components/Alert.jsx';
import Spinner from '../components/Spinner.jsx';
import bankyHeroImage from '../assets/banky-image.png';

// Statuses from your original code
const STATUS_IDLE = 'idle';
const STATUS_AUTHENTICATING = 'authenticating';
const STATUS_VERIFYING = 'verifying';
const STATUS_CHECKING = 'checking';
const STATUS_FINALIZING = 'finalizing';
const STATUS_SUCCESS = 'success';
const STATUS_ERROR = 'error';

const LoginPage = ({ onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, setAuthState, isLoading: isAuthLoading, authError, clearAuthError } = useAuth();
    const [processStatus, setProcessStatus] = useState(STATUS_IDLE);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const timeoutRef = useRef(null);

    useEffect(() => { return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }; }, []);
    useEffect(() => { if (processStatus === STATUS_SUCCESS) { timeoutRef.current = setTimeout(() => { setProcessStatus(STATUS_IDLE); setFeedbackMessage(''); }, 3500); } return () => { if (timeoutRef.current && processStatus === STATUS_SUCCESS) clearTimeout(timeoutRef.current); }; }, [processStatus]);

    // --- *** Restored ORIGINAL handleSubmit Logic *** ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        clearAuthError(); setFeedbackMessage(''); setProcessStatus(STATUS_AUTHENTICATING);
        setFeedbackMessage('Authenticating...'); console.log("handleSubmit: Set status to AUTHENTICATING");
        const authResult = await login({ email, password });
        console.log("handleSubmit: login() call returned:", authResult);
        if (authResult && authResult.token && authResult.user) { // Check response structure
            console.log("handleSubmit: Login successful, starting simulation...");
            setProcessStatus(STATUS_VERIFYING); setFeedbackMessage('Verifying credentials...');
            timeoutRef.current = setTimeout(() => {
                console.log(">>> Timeout 1 Fired - CHECKING"); setProcessStatus(STATUS_CHECKING); setFeedbackMessage('Checking account status...');
                timeoutRef.current = setTimeout(() => {
                    console.log(">>> Timeout 2 Fired - FINALIZING"); setProcessStatus(STATUS_FINALIZING); setFeedbackMessage('Finalizing login...');
                    timeoutRef.current = setTimeout(() => {
                        console.log(">>> Timeout 3 Fired - SUCCESS"); setProcessStatus(STATUS_SUCCESS); setFeedbackMessage('Login successful! Redirecting...');
                        timeoutRef.current = setTimeout(() => {
                             console.log(">>> Timeout 4 Fired - setAuthState");
                             setAuthState(authResult.token, authResult.user); // Called LATE as per original
                        }, 500);
                    }, 1500);
                }, 2000);
            }, 1800);
        } else { console.log("handleSubmit: Login API failed"); setProcessStatus(STATUS_ERROR); setFeedbackMessage(''); setPassword(''); }
    };
    // --- *** End Restored handleSubmit Logic *** ---

    const isLoading = isAuthLoading || (processStatus !== STATUS_IDLE && processStatus !== STATUS_SUCCESS && processStatus !== STATUS_ERROR);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-blue-700 text-white shadow sticky top-0 z-20"> <nav className="container mx-auto px-4 py-3 flex justify-between items-center"> <div className="text-xl font-semibold"> Banky </div> <button type="button" className="p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-label="Open main menu"> <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg> </button> </nav> </header>
            {/* Main */}
            <main className="flex-grow">
                {/* Hero/Login Section */}
                 <section className="relative flex items-center justify-center py-16 md:py-20 px-4 overflow-hidden min-h-[500px] md:min-h-[600px]">
                     <img src={bankyHeroImage} alt="Background" className="absolute inset-0 w-full h-full object-cover z-0 filter blur-[2px] opacity-80"/>
                     <div className="absolute inset-0 bg-black/10 z-0"></div>
                     <div className="relative z-10 w-full max-w-md mx-auto">
                         <Card className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200/50">
                              <CardHeader className="pt-6 pb-4"> <CardTitle className="text-center text-xl font-semibold text-gray-800">Banky App Login</CardTitle> <CardDescription className="text-center text-gray-500 text-sm">Enter your credentials below</CardDescription> </CardHeader>
                              <CardContent className="px-6 pb-6">
                                   <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Alerts */}
                                         <Alert variant="destructive" show={!!authError || processStatus === STATUS_ERROR}> <AlertTitle>Login Failed</AlertTitle> <AlertDescription>{authError || 'Invalid credentials or error.'}</AlertDescription> </Alert>
                                         <Alert variant="success" show={processStatus === STATUS_SUCCESS}> <AlertTitle>Success</AlertTitle> <AlertDescription>{feedbackMessage || 'Login successful!'}</AlertDescription> </Alert>
                                         {/* Info Alert for processing steps */}
                                         <Alert variant="info" show={isLoading && processStatus !== STATUS_AUTHENTICATING && processStatus !== STATUS_IDLE && processStatus !== STATUS_ERROR && processStatus !== STATUS_SUCCESS}> <AlertTitle>Processing...</AlertTitle> <AlertDescription>{feedbackMessage}</AlertDescription> </Alert>
                                         <Alert variant="info" show={processStatus === STATUS_AUTHENTICATING}> <AlertTitle>Processing...</AlertTitle> <AlertDescription>{feedbackMessage}</AlertDescription> </Alert>

                                         {/* Inputs (Original structure, no icons/toggle) */}
                                          <div className="space-y-1">
                                              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
                                          </div>
                                          <div className="space-y-1">
                                              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
                                          </div>

                                        {/* Submit Button */}
                                        <Button type="submit" className="w-full !mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 text-white font-medium" size="lg" disabled={isLoading}>
                                             {isLoading ? <><Spinner size="sm" className="mr-2" /> {feedbackMessage || 'Processing...'} </> : 'Login'}
                                         </Button>
                                     </form>
                                </CardContent>
                                {/* Original Card Footer */}
                                <CardFooter className="flex justify-center pt-4 pb-5 border-t border-gray-200/80"> <p className="text-sm text-gray-600"> No account?{' '} <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-800 font-medium" onClick={onSwitchToRegister} disabled={isLoading}> Register here </Button> </p> </CardFooter>
                          </Card>
                     </div>
                 </section>
                 {/* Other Sections */}
                 <section className="py-16 md:py-20 px-6 text-center bg-white"> {/* Financial Planning */} {/* ... content ... */} </section>
                 <section id="stock-info" className="py-16 md:py-20 px-4 bg-gray-50"> {/* Stock Info */} {/* ... content ... */} </section>
            </main>
            {/* Footer */}
            <footer className="bg-gray-800 text-gray-400 py-8 mt-auto"> {/* Footer */} {/* ... content ... */} </footer>
        </div>
    );
};
export default LoginPage;