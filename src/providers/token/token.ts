import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class TokenProvider {
  constructor(private storage: Storage) {}

  SetToken(token) {
    console.log(token);
    return this.storage.set('auth-token', token);
  }

  async GetToken() {
    return await this.storage.get('auth-token');
  }

  SeleteToken() {
    this.storage.remove('auth-token');
  }

  async GetPayload() {
    const token = await this.storage.get('auth-token');
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = JSON.parse(window.atob(payload));
    }
    return payload.data;
  }

  DeleteToken() {
    this.storage.remove('auth-token');
  }
}
