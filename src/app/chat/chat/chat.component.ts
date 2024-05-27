import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Offer } from '../../offer/offer.model';
import { Profile } from '../../profile/profile.model';
import { Chat } from '../chat.model';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../chat.service';
import { ProfileService } from '../../profile/profile.service';
import { AuthService } from '../../auth/auth.service';
import { OfferService } from '../../offer/offer.service';
import { Message } from '../message.model';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription, map } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.sass'
})
export class ChatComponent implements OnDestroy, OnInit{

  offer!: Offer
  userProfile!: Profile
  receiverProfile!: Profile
  chat!: Chat
  userID!: string
  receiverID!: string
  messages: Message[] = []
  chatForm!: FormGroup
  private socketSubscription!: Subscription
  private messagesSubs!: Subscription
  offset: number = 0
  limit: number = 12

  constructor(private socket: Socket, private route: ActivatedRoute, private chatService: ChatService, private profileService: ProfileService, private authService: AuthService, private el: ElementRef) {}


  ngOnInit(): void {
    this.chatForm = new FormGroup({
      'message': new FormControl(null)
    })

    this.socket.connect();
    this.userID = this.authService.getUserId();
    this.chatService.getChat(this.route.snapshot.params['chatID']).subscribe({
      next: chat => {
        this.chat = chat;
        if (chat) {
          if (this.userID === chat.seller) {
            this.receiverID = chat.buyer
          } else {
            this.receiverID = chat.seller
          }

          this.profileService.getProfileByUserID(this.userID).subscribe({
            next: profile => {
              this.userProfile = profile
            }
          })
      
          this.profileService.getProfileByUserID(this.receiverID).subscribe({
            next: profile => {
              this.receiverProfile = profile
            }
          })
          this.socket.emit('join', { userID: this.userID, chatID: chat.id })
          this.socketSubscription = this.socket.fromEvent<{ _id: string, sender: string, receiver: string, date: Date, msg: string, chat: string }>('receiveMessage').pipe(map(message => {
            return {
              id: message._id,
              sender: message.sender,
              receiver: message.receiver,
              date: message.date,
              msg: message.msg,
              chat: message.chat
            }
          }))
          .subscribe({
            next: messageFetched => {
              this.messages.push(messageFetched)
            }
          })
          this.chatService.getMessages(this.userID, this.receiverID, this.chat.id, this.offset, this.limit)
          this.messagesSubs = this.chatService.getMessageUpdateListener().subscribe({
            next: messages => {
              this.messages = messages.messages
              this.offset += this.limit
              console.log(this.messages)
            }
          })
          
        }
      }
    })
    document.body.classList.add('no-scroll-page')
  }


  ngOnDestroy(): void {
    this.socket.disconnect();
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
    if (this.messagesSubs) {
      this.messagesSubs.unsubscribe();
    }
    document.body.classList.remove('no-scroll-page')
  }

  sendMessage() {
    if (!this.chatForm.get('message')?.value) {
      return
    }
    const msg = this.chatForm.value.message
    this.socket.emit('sendMessage', {
      sender: this.userID,
      receiver: this.receiverID,
      msg: msg,
      chat: this.chat.id
    })

    this.chatForm.reset()
  }

  onScroll() {
    console.log('scrolluje')
    if (this.messages.length > 0) {
      const lastMessageID = this.messages[0].id;
      this.chatService.getMoreMessages(this.chat.id, lastMessageID, this.limit).subscribe({
        next: messages => {
          this.messages = [...messages, ...this.messages];
          this.offset += this.limit
        }
      })
    }
  }
}
