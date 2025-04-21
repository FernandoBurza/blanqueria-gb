import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare const MercadoPago: any;

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
})
export class WalletComponent implements OnInit {
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    if (typeof MercadoPago === 'undefined') {
      this.loadMercadoPagoSDK().then(() => this.initMercadoPago());
    } else {
      this.initMercadoPago();
    }
  }

  loadMercadoPagoSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.onload = () => resolve();
      script.onerror = () => reject('Error al cargar el SDK de MercadoPago');
      document.body.appendChild(script);
    });
  }

  initMercadoPago(): void {
    const mp = new MercadoPago('APP_USR-4b29084f-1755-4bcd-8024-23faee98bec8', { locale: 'es-AR' });


    this.http
      .post<{ id: string }>('http://localhost:3000/create-preference', {
        title: 'Producto Ejemplo',
        quantity: 1,
        price: 100,
      })
      .subscribe({
        next: (response) => this.initMercadoPagoEmbed(mp, response.id),
        error: (error) => console.error('Error al crear la preferencia', error),
      });
  }

  initMercadoPagoEmbed(mp: any, preferenceId: string): void {
    mp.bricks().create("wallet", "wallet_container", {
      initialization: { preferenceId },
      customization: { visual: { buttonBackground: '#1E88E5' } },
      callbacks: {
        onSubmit: () => console.log("Pago enviado"),
        onError: (error: any) => console.error("Error en el pago:", error),
        onReady: () => console.log("El checkout está listo"),
      },
    });
  }
}
