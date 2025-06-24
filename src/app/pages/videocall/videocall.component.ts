import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as SocketClient from 'videocall-client-socket';
import { AuthService } from '../../services/auth.service';
import { NgClass } from '@angular/common';
import Hashids from 'hashids';

@Component({
  selector: 'app-videocall',
  standalone: true,
  imports: [NgClass],
  templateUrl: './videocall.component.html',
  styleUrl: './videocall.component.css'
})
export class VideocallComponent {
  activedRouter = inject(ActivatedRoute)
  authService = inject(AuthService)
  router = inject(Router)

  channel: string = ""
  enableCamera: boolean = true;
  enableAudio: boolean = true;

  nombreLocal: string = "";
  nombreRemoto: string = "";
  isDoctor: boolean = false
  userId: string = "";
  roomId: string = "";
  isRemoteCameraOn: boolean = true;
  isRemoteAudioOn: boolean = true;
  initialsName: string = "";

  ngOnInit(): void {
    this.activedRouter.paramMap.subscribe(async (param) => {
      var id = param.get('userId')!;
      
      const hashids = new Hashids()
      this.userId = hashids.decode(id)[0].toString();
      
      this.roomId = param.get('roomId')!;
      console.log(this.roomId);
      this.channel = this.roomId;
      
      this.authService.getUserById(Number(this.userId)).then((data) => {
        this.nombreLocal = `${data.usuario.firstName} ${data.usuario.lastName} ${data.usuario.middleName}`;
        this.isDoctor = data.usuario.rol.rol.toUpperCase() === 'MÉDICO';
      })
    });

    SocketClient.setServerURL("https://node-videocall-server.onrender.com");

    this.startCall();
  }

  startCall() {
    this.initDevices(this.userId, this.channel);
  }

  async initDevices(userId: string, channelName: string) {
    SocketClient.on("user-published", (data) => { this.handleUserPublished(data); });
    SocketClient.on("user-unpublished", (data) => { this.handleUserUnpublished(data); });
    SocketClient.on("user-media-toggled", (data) => { this.handleUserMediaToggled(data); });
    await SocketClient.createMediaStream();
    SocketClient.playVideoTrack('localVideo');

    SocketClient.joinChannel(userId, channelName);
  }

  handleUserPublished(data: any) {
    const { user, mediaType } = data;
    if (mediaType === 'video') {
      const video = document.createElement('video');
      video.srcObject = user.videotrack;
      video.autoplay = true;
      video.id = `${user.uuid}`;
      video.style.width = '100%';
      video.style.height = '100%';
      var container = document.getElementById('video-container');
      if (container) {
        container.appendChild(video);
      }
    }
    console.log("handleUserPublished", data);

    this.authService.getUserById(Number(user.uuid)).then((data) => {
      this.nombreRemoto = `${data.usuario.firstName} ${data.usuario.lastName} ${data.usuario.middleName}`
    });

  }

  handleUserUnpublished(data: any) {
    const { user, mediaType } = data;
    if (mediaType === 'video') {
      const video = document.getElementById(`${user.uuid}`);
      if (video) {
        video.remove();
      }
    }
    console.log("handleUserUnpublished", data);
    this.nombreRemoto = "";
  }

  handleUserMediaToggled(data: any) {
    if (data.type == "video") {
      this.isRemoteCameraOn = data.enabled
    }

    if (data.type == "Audio") {
      this.isRemoteCameraOn = data.enabled
    }
  }

  leaveChannel() {
    SocketClient.off("user-published", this.handleUserPublished);
    SocketClient.off("user-unpublished", this.handleUserUnpublished);
    SocketClient.leaveChannel();

    window.close();
  }


  toggleCamera() {
    var isOn = SocketClient.isCameraOn();
    var value = !isOn;
    this.enableCamera = value;
    SocketClient.toggleCamera(value);
    if (this.enableCamera == true) {
      setTimeout(() => {
        SocketClient.playVideoTrack('localVideo');
      }, 100);
    }

  }

  toggleAudio() {
    var isOn = SocketClient.isAudioOn();
    var value = !isOn
    this.enableAudio = value;
    SocketClient.toggleAudio(value);
  }

  getInitials(name: string) {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0][0].toUpperCase();
    } else {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
  }

}
