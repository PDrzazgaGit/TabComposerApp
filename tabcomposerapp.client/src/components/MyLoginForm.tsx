import React, { useState, ChangeEvent, FormEvent } from 'react';

// Typy stanu formularza
interface LoginFormState {
    email: string;
    password: string;
    errorMessage: string;
    isLoading: boolean;
}

export const MyLoginForm: React.FC = () => {
    // Stan formularza
    const [state, setState] = useState<LoginFormState>({
        email: '',
        password: '',
        errorMessage: '',
        isLoading: false,
    });

    // Funkcja do obs³ugi zmian w polach formularza
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Funkcja do obs³ugi wysy³ania formularza
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setState((prevState) => ({ ...prevState, isLoading: true, errorMessage: '' }));

        // Symulacja logowania (tutaj mo¿na podpi¹æ API)
        if (state.email === 'test@example.com' && state.password === 'password123') {
            alert('Zalogowano pomyœlnie!');
            // Po zalogowaniu, mo¿na przekierowaæ u¿ytkownika, np. do dashboardu
        } else {
            setState((prevState) => ({
                ...prevState,
                errorMessage: 'Niepoprawny e-mail lub has³o.',
            }));
        }

        setState((prevState) => ({ ...prevState, isLoading: false }));
    };

    return (
        <div className="container justify-content-center">
            <div className="">
                <div className="">
                    
                    <form onSubmit={handleSubmit}>
                        {/* Pole E-mail */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">E-mail</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={state.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Pole Has³o */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={state.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Komunikat o b³êdzie */}
                        {state.errorMessage && <div className="alert alert-danger">{state.errorMessage}</div>}

                        {/* Przycisk logowania */}
                        <div className="d-grid gap-2">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={state.isLoading}
                            >
                                {state.isLoading ? 'Loading...' : ''}
                            </button>
                        </div>
                    </form>
                    <div className="mt-3 text-center">
                        <a href="/forgot-password">Forggot your password?</a>
                    </div>
                </div>
            </div>
        </div>
    );
};