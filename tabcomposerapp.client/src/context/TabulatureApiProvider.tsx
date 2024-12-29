import { ReactNode, useEffect, useMemo, useState } from 'react';
import { TabulatureApiContext } from './TabulatureApiContext';
import {  TabulatureManagerApi } from '../api/TabulatureManagerApi';
import { TabulatureDataModel } from '../models/TabulatureDataModel';
import { ITabulature } from '../models';
import { autorun } from 'mobx';

interface TabulatureApiProviderProps {
    children: ReactNode;
}

export const TabulatureApiProvider: React.FC<TabulatureApiProviderProps> = ({ children }) => {

    const tabulatureManagerApi: TabulatureManagerApi = useMemo(() => new TabulatureManagerApi(), []);

    const updateTabulature = async (token: string): Promise<boolean> => {
        return await tabulatureManagerApi.updateTabulature(token);
    }

    const addTabulature = async (token: string, tabulature: ITabulature): Promise<boolean> => {
        return await tabulatureManagerApi.addTabulature(token, tabulature);
    }

    const deleteTabulature = async (token: string, id: number): Promise<boolean> => {
        return await tabulatureManagerApi.deleteTabulature(token, id);
    }

    const downloadTabulature = async (id: number): Promise<ITabulature | null> => {
        return await tabulatureManagerApi.downloadTabulature(id);
    }

    const getUserTabulatureInfo = async (token: string): Promise<Record<number, TabulatureDataModel> | null> => {
        return await tabulatureManagerApi.getUserTabulaturesInfo(token);
    }

    const getTabulature = () => {
        return tabulatureManagerApi.getTabulature();
    }

    const value = {
        tabulatureManagerApi,
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