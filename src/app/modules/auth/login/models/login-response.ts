export interface LoginResponse {
    token: string;
    refreshToken: string;
    retorno: number;
    message: string;
    numePers: string;
    roles: number[];
}