import { DetalleVenta } from "src/app/shared/entities/detalleVenta";

export interface Venta {
    idVenta: number;
    idCliente: number;
    metodo: string;
    modalidad: string;
    cuotas: number;
    total: number;
    mostrarDetalles: boolean;
    detalleVenta: DetalleVenta[];
}