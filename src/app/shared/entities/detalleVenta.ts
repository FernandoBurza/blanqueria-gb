export interface DetalleVenta {
    idVenta: number;
    fechaVencimiento: any;
    fechaPago: any;
    montoCuota: number;
    pagada: boolean;
    idCuota: number;
    habilitadaParaPagar?: boolean;
}