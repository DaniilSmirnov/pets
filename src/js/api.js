import axios from 'axios';
import { dd } from './helpers';


const API_URL 	= 'https://vargasoff.ru:8000/';

axios.defaults.headers.common = {
    Accept: "application/json, text/plain, */*"
}

export default class API {

    constructor() {
        dd('API: ', 'init');
    }

    async send(method = 'GET', action, data = {}) {
        const response = await axios({
            method,
            url: `${API_URL}${action}`,
            data
        }).catch(error => {
            console.error('Error API:', error);
        //    window.showAlert(getMessage('server_offline'));
          //  return { "status": false, "failed": error.response.data.message }
        });
        return response ? response.data : [];
    }

    async POSTGeoPosition(meet) {
        let response = await this.send('POST', 'GeoPosition', meet);

        dd('API: ', 'POSTGeoPosition', response);

        return response;
    }
    async GetGeoPosition(location) {
        let response = await this.send('GET',  `GeoPosition?meet=${location.meet}`, null);

        dd('API: ', 'GetGeoPosition', response);

        return response;
    }
    async AddMeet(meet) {
        let response = await this.send('POST', 'AddMeet', meet);

        dd('API: ', 'AddMeet', response);
        /*
        if(!response){
          response = { failed: 'Нельзя создать больше трёх митингов в день' }
        }*/

        return response;
    }
    async IsFirst(id) {
      console.log(id)
        const response = await this.send('GET', `IsFirst?id=${id}`, null);

        dd('API: ', 'IsFirst', id, response);

        return response;
    }
    async getStory(meet) {
        const response = await this.send('GET', `getStory?meet=${meet}`, null);

        dd('API: ', 'getStory', response);

        return response;
    }
   async AddUser() {
        const response = await this.send('POST', 'AddUser', null);

        dd('API: ', 'AddUser', response);

        return response;
    }
    async UpdateUser() {
        const response = await this.send('POST', 'UpdateUser', null);

        dd('API: ', 'UpdateUser', response);

        return response;
    }

    /**
     * Получить список митиног
     * @return array
     */
    async GetMeets() {
        const meets = await this.send('GET', `GetMeets`, null);

        dd('API: ', 'GetMeets', meets);

        if(!meets.failed) {
          return meets.reverse();
        } else return [];
    }
    async GetMeet(meetId) {
        const meet = await this.send('GET', `GetMeet?meet=${meetId}`, null);

        dd('API: ', 'GetMeet', meet);

          return meet;
    }
    async GetAllMeets() {
        const allMeets = await this.send('GET', `admin/GetAllMeets`, null);
        dd('API: ', 'GetAllMeets', allMeets);

        if(!allMeets.failed) {
          return allMeets.reverse();
        } else return [];

    }
    async GetExpiredUserMeets() {
        const expireduserMeets = await this.send('GET', `GetExpiredUserMeets`, null);
        dd('API: ', 'GetExpiredUserMeets', expireduserMeets);

        if(!expireduserMeets.failed) {
          return expireduserMeets.reverse();
        } else return [];

    }
    async GetOwneredMeets() {
        const ownereduserMeets = await this.send('GET', `GetOwneredMeets`, null);
        dd('API: ', 'GetOwneredMeets', ownereduserMeets);

        if(!ownereduserMeets.failed) {
          return ownereduserMeets.reverse();
        } else return [];

    }
    async RateComment(data) {
      const response = await this.send('POST', 'RateComment', data);

      dd('API: ', 'RateComment', response);

      return response;
    }
    async GetUserMeets() {
        const userMeets = await this.send('GET', `GetUserMeets`, null);
        dd('API: ', 'GetUserMeets', userMeets);

        if(!userMeets.failed) {
          return userMeets.reverse();
        } else return [];

    }

    async AddMeetMember(data) {
      const response = await this.send('POST', 'AddMeetMember', data);

      dd('API: ', 'AddMeetMember', response);

      return response;
    }
    async RemoveMeetMember(data) {
      const response = await this.send('POST', `RemoveMeetMember`, data);

      dd('API: ', 'RemoveMeetMember', response);

      return response;
    }

    async AddComment(data) {
      let result =  await this.send('POST', `AddComment`, data);

        dd('API: ', 'AddComment', result);
        return result;
    }

    async GetMeetComments(meet) {

      let comments =  await this.send('GET', `GetMeetComments?meet=${meet}`, null);

        dd('API: ', 'GetMeetComments', comments);
        return comments;
    }

    async RemoveComment(data) {
      let result =  await this.send('POST', `RemoveComment`, data);

        dd('API: ', 'RemoveComment', result);
        return result;
    }

    async Approve(data) {
      const response = await this.send('POST', `admin/Approve`, data);

      dd('API: ', 'Approve', response);

      return response;
    }
    async DeApprove(data) {
      const response = await this.send('POST', `admin/DeApprove`, data);

      dd('API: ', 'DeApprove', response);

      return response;
    }


}
