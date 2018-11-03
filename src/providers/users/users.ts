import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
const BaseUrl = 'http://localhost:3000/api/chatApp';

@Injectable()
export class UsersProvider {
  constructor(public http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get(`${BaseUrl}/users`);
  }

  // Follow user
  followUser(id): Observable<any> {
    return this.http.post(`${BaseUrl}/follow-user`, { userFollowed: id });
  }

  getUserById(id): Observable<any> {
    return this.http.get(`${BaseUrl}/users/${id}`);
  }

  getUserByName(username): Observable<any> {
    return this.http.get(`${BaseUrl}/username/${username}`);
  }

  // unfollow User
  unfollowUser(userFollowed): Observable<any> {
    return this.http.post(`${BaseUrl}/unfollow-user`, { userFollowed });
  }

  // markNotification
  MarkNotification(id, deleteVal?): Observable<any> {
    return this.http.post(`${BaseUrl}/mark/${id}`, { id, deleteVal });
  }

  // MarkAllAsRead
  markAllAsRead(): Observable<any> {
    return this.http.post(`${BaseUrl}/mark-all`, {
      all: true
    });
  }

  // Image
  addImage(image): Observable<any> {
    return this.http.post(`${BaseUrl}/upload-image`, {
      image
    });
  }

  //
  setProfileImage(imageId, imageVersion): Observable<any> {
    return this.http.get(
      `${BaseUrl}/set-default-image/${imageId}/${imageVersion}`
    );
  }

  // Profile Notifications
  ProfileNotification(id): Observable<any> {
    console.log(id);
    return this.http.post(`${BaseUrl}/user/view-profile`, { id });
  }

  // change password
  ChangePassword(body): Observable<any> {
    console.log(body);
    return this.http.post(`${BaseUrl}/change-password`, body);
  }
}
