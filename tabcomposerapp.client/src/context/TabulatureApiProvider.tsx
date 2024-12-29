import { ReactNode, useMemo } from 'react';
import { TabulatureApiContext } from './TabulatureApiContext';
import { TabulatureManagerApi } from '../api/TabulatureManagerApi';
import { TabulatureDataModel } from '../models/TabulatureDataModel';
import { ITabulature } from '../models';

interface TabulatureApiProviderProps {
    children: ReactNode;
}

export const TabulatureApiProvider: React.FC<TabulatureApiProviderProps> = ({ children }) => {

    const clientApi: TabulatureManagerApi = useMemo(() => new TabulatureManagerApi(), []);

    const updateTabulature = async (token: string): Promise<boolean> => {
        return await clientApi.updateTabulature(token);
    }

    const addTabulature = async (token: string, tabulature: ITabulature): Promise<boolean> => {
        return await clientApi.addTabulature(token, tabulature);
    }

    const deleteTabulature = async (token: string, id: number): Promise<boolean> => {
        return await clientApi.deleteTabulature(token, id);
    }

    const downloadTabulature = async (id: number): Promise<ITabulature | null> => {
        return await clientApi.downloadTabulature(id);
    }

    const getUserTabulatureInfo = async (token: string): Promise<Record<number, TabulatureDataModel> | null> => {
        return await clientApi.getUserTabulaturesInfo(token);
    }

    const getTabulature = () => {
        return clientApi.getTabulature();
    }

    const value = {
        getTabulature,
        updateTabulature,
        addTabulature,
        deleteTabulature,
        downloadTabulature,
        getUserTabulatureInfo
    }

    return (
        <TabulatureApiContext.Provider value={value}>
            {children}
        </TabulatureApiContext.Provider>
    );
};