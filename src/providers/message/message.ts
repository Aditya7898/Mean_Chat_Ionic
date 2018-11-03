import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
const BaseUrl = 'http://localhost:3000/api/chatApp';

@Injectable()
export class MessageProvider {
  constructor(public http: HttpClient) {}

  SendMessage(sender_Id, receiver_Id, receivername, message): Observable<any> {
    return this.http.post(
      `${BaseUrl}/chat-messages/${sender_Id}/${receiver_Id}`,
      {
        receiver_Id,
        receivername,
        message
      }
    );
  }

  GetAllMessages(sender_Id, receiver_Id): Observable<any> {
    return this.http.get(
      `${BaseUrl}/chat-messages/${sender_Id}/${receiver_Id}`
    );
  }

  MarkMessages(sender, receiver): Observable<any> {
    return this.http.get(`${BaseUrl}/receiver-messages/${sender}/${receiver}`);
  }

  MarkAllMessages(): Observable<any> {
    return this.http.get(`${BaseUrl}/mark-all-messages`);
  }
}
