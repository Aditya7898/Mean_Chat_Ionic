import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
const BaseUrl = 'http://localhost:3000/api/chatApp';

@Injectable()
export class PostProvider {
  constructor(public http: HttpClient) {}

  AddPost(body): Observable<any> {
    return this.http.post(`${BaseUrl}/post/add-post`, body);
  }

  GetAllPosts(): Observable<any> {
    return this.http.get(`${BaseUrl}/posts`);
  }

  AddLike(body): Observable<any> {
    return this.http.post(`${BaseUrl}/post/add-like`, body);
  }

  AddComment(postId, comment): Observable<any> {
    return this.http.post(`${BaseUrl}/post/add-comment`, { postId, comment });
  }

  GetPost(id): Observable<any> {
    return this.http.get(`${BaseUrl}/post/${id}`);
  }
}
