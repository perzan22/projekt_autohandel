import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Chat } from '../chat.model';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { OfferService } from '../../offer/offer.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.sass'
})
export class ChatListComponent implements OnInit, OnDestroy{

  userID!: string
  chats: Chat[] = []
  chatsSubs!: Subscription

  constructor(private chatService: ChatService, private authService: AuthService) {}
  

  ngOnInit(): void {
    if (this.authService.getIsAuth()) {
      this.userID = this.authService.getUserId();
    }

    this.chatService.getUserChats(this.userID)
    this.chatsSubs = this.chatService.getChatUpdateListener().subscribe({
      next: chats => {
        this.chats = chats.chats
        console.log(this.chats)
      }
    })
  }

  ngOnDestroy(): void {
    this.chatsSubs.unsubscribe()
  }




}
