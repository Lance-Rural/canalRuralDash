import axios from 'axios';

const streaming = axios.create({
  baseURL: `https://vdo.alright.global:5443/`
});


export {
    streaming
}
// http://vdo.alright.global:5080/alright/rest/v2/broadcasts/list/0/3