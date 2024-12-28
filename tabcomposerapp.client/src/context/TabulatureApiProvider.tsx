import { ReactNode } from 'react';
import { TabulatureApiContext } from './TabulatureApiContext';
import { TabulatureManagerApi } from '../api/TabulatureManagerApi';

interface TabulatureApiProviderProps {
    children: ReactNode;
}

export const TabulatureApiProvider: React.FC<TabulatureApiProviderProps> = ({ children }) => {

    const tabulatureManagerApi: TabulatureManagerApi = new TabulatureManagerApi();

    const value = {
        tabulatureManagerApi
    }

    return (
        <TabulatureApiContext.Provider value={value}>
            {children}
        </TabulatureApiContext.Provider>
    );
};