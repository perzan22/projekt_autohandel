import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ChatService {

    constructor(private http: HttpClient) {}

    openChat(sellerID: string, buyerID: string, offerID: string) {
        this.http.post('http://localhost:3000/chat/', {seller: sellerID, buyer: buyerID, offer: offerID}).subscribe({
            next: () => {
                console.log('Chat opened successfully')
            }
        })
    }

}