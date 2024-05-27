import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Chat } from "./chat.model";
import { Router } from "@angular/router";
import { Subject, map } from "rxjs";
import { Message } from "./message.model";
import { Offer } from "../offer/offer.model";

@Injectable({ providedIn: 'root' })
export class ChatService {

    chat!: Chat
    chatID!: string
    messages: Message[] = []
    private messagesSubs = new Subject<{ messages: Message[] }>
    chats: Chat[] = []
    private chatsSubs = new Subject<{ chats: Chat[] }>

    constructor(private http: HttpClient, private router: Router) {}

    getMessageUpdateListener() {
        return this.messagesSubs.asObservable()
    }

    getChatUpdateListener() {
        return this.chatsSubs.asObservable()
    }

    openChat(sellerID: string, buyerID: string, offerID: string) {
        this.http.post<{ message: string, chat: Chat }>('http://localhost:3000/api/chat/open', {seller: sellerID, buyer: buyerID, offer: offerID}).subscribe({
            next: chatOpened => {
                console.log('Chat opened successfully')
                this.chat = chatOpened.chat
                this.chatID = chatOpened.chat.id
                this.router.navigate(['/chat/' + this.chatID])
            }
        })
    }

    getChat(chatID: string) {
        return this.http.get<{ _id: string, buyerID: string, sellerID: string, offerID: Offer }>('http://localhost:3000/api/chat/' + chatID).pipe(map(chat => {
            return {
                id: chat._id,
                buyer: chat.buyerID,
                seller: chat.sellerID,
                offer: chat.offerID
            }
        }))
    }

    getMessages(senderID: string, receiverID: string, chatID: string, offset: number, limit: number) {

        const query = `?senderID=${senderID}&receiverID=${receiverID}&chatID=${chatID}&offset=${offset}&limit=${limit}`
        this.http.get<{info: string, messages: any}>('http://localhost:3000/api/chat' + query).pipe(map(messagesData => {
            return {
                messages: messagesData.messages.map((message: {_id: string, receiver: string, sender: string, date: string, msg: string, chat: string}) => {
                    return {
                        id: message._id,
                        sender: message.sender,
                        receiver: message.receiver,
                        date: message.date,
                        chat: message.chat,
                        msg: message.msg
                    }
                })
            }
        }))
        .subscribe({
            next: messagesFetched => {
                this.messages = messagesFetched.messages
                this.messagesSubs.next( { messages: [...this.messages] } )
            }
        })
    }

    getMoreMessages(chatID: string, lastMessageID: string, limit: number) {
        const query = `?chatID=${chatID}&lastMessageID=${lastMessageID}&limit=${limit}`;

        return this.http.get<{ info: string, messages: any }>('http://localhost:3000/api/chat/moreMessages' + query).pipe(map(messagesData => {
            return messagesData.messages.map((message: { _id: string, receiver: string, sender: string, date: string, msg: string, chat: string }) => {
                return {
                    id: message._id,
                    sender: message.sender,
                    receiver: message.receiver,
                    date: message.date,
                    chat: message.chat,
                    msg: message.msg
                }
            });
        }));
    }

    getUserChats(userID: string) {
        this.http.get<{ message: string, chats: any }>('http://localhost:3000/api/chat/userChats/' + userID).pipe(map(chatsData => {
            return {
                chats: chatsData.chats.map((chat: { _id: string, offerID: string, sellerID: string, buyerID: string }) => {
                    return {
                        id: chat._id,
                        buyer: chat.buyerID,
                        seller: chat.sellerID,
                        offer: chat.offerID
                    }
                })
            }
        }))
        .subscribe({
            next: chatsFetched => {
                this.chats = chatsFetched.chats
                this.chatsSubs.next({ chats: [...this.chats] })
            }
        })
    }

}