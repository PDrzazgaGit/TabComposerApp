export interface TabulatureDataModel {
    title: string;
    created: string;
    length: number;
    tuning: { notation: number }[];
    description: string;
}