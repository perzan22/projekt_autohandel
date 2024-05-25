import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  constructor(private socket: Socket, private route: ActivatedRoute, private chatService: ChatService, private profileService: ProfileService, private authService: AuthService, private offerService: OfferService) {}


  ngOnInit(): void {
    this.chatForm = new FormGroup({
      'message': new FormControl(null, {
        validators: [Validators.required]
      })
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
          this.offerService.getOffer(chat.offer).subscribe({
            next: offer => {
              this.offer = offer
            }
          })
          this.socket.emit('join', { userID: this.userID })
          this.socketSubscription = this.socket.fromEvent<{ _id: string, sender: string, receiver: string, date: Date, msg: string }>('receiveMessage').pipe(map(message => {
            return {
              id: message._id,
              sender: message.sender,
              receiver: message.receiver,
              date: message.date,
              msg: message.msg
            }
          }))
          .subscribe({
            next: messageFetched => {
              this.messages.push(messageFetched)
            }
          })
          this.chatService.getMessages(this.userID, this.receiverID)
          this.messagesSubs = this.chatService.getMessageUpdateListener().subscribe({
            next: messages => {
              this.messages = messages.messages
            }
          })
          
        }
      }
    })
  }


  ngOnDestroy(): void {
    this.socket.disconnect();
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
    if (this.messagesSubs) {
      this.messagesSubs.unsubscribe();
    }
  }

  sendMessage() {
    if (this.chatForm.invalid) {
      return
    }
    const msg = this.chatForm.value.message
    console.log('Sending message"', {
      sender: this.userID,
      receiver: this.receiverID,
      msg: msg
    })
    this.socket.emit('sendMessage', {
      sender: this.userID,
      receiver: this.receiverID,
      msg: msg
    })

    this.chatForm.reset();
  }
}
