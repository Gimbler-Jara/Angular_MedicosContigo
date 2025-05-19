import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as SocketClient from 'videocall-client-socket';
import { AuthService } from '../../services/auth.service';
import { NgClass } from '@angular/common';

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
  isRemoteCameraOn: boolean = true;
  isRemoteAudioOn: boolean = true;
  isLocalCameraOn: boolean = true;
  isLocalAudioOn: boolean = true;
  initialsName: string = "";

  ngOnInit(): void {
    this.activedRouter.paramMap.subscribe(async (param) => {
      this.userId = param.get('userId')!;
      this.authService.getUserById(Number(this.userId)).then((user) => {

        this.nombreLocal = `${user.firstName} ${user.lastName} ${user.middleName}`;

        this.isDoctor = user.rol.rol.toUpperCase() === 'MÉDICO';
        this.channel = String(user.activo);
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

    this.authService.getUserById(Number(user.uuid)).then((user) => {
      this.nombreRemoto = `${user.firstName} ${user.lastName} ${user.middleName}`
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
    // console.log(data.user.uuid, data.type, data.enabled);
    if (data.user.uuid != this.userId) {
      if (data.type == "video") {
        this.isRemoteCameraOn = data.enabled
        console.log("remote " + this.isRemoteCameraOn);
      }

      if (data.type == "Audio") {
        this.isRemoteCameraOn = data.enabled
        console.log(this.isRemoteCameraOn);
      }
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
    this.enableCamera = !this.enableCamera;
    this.isLocalCameraOn = !this.isLocalCameraOn;
    console.log(this.isLocalCameraOn);

    SocketClient.toggleCamera(value);
  }

  toggleAudio() {
    var isOn = SocketClient.isAudioOn();
    var value = !isOn
    this.enableAudio = !this.enableAudio;
    this.isLocalAudioOn = !this.isLocalAudioOn;
    console.log(this.isLocalAudioOn);

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
