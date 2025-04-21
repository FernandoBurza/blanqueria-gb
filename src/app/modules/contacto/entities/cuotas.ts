export interface Cuotas {
    monto: number;
    fechaVencimiento: string;
    pagada: boolean;
    fechaPago?: string;
}