import { Component, OnDestroy, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.sass'
})
export class ChatComponent implements OnDestroy, OnInit{


  constructor(private socket: Socket) {}


  ngOnInit(): void {
    this.socket.connect();
  }


  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
