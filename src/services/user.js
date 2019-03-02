import request from '../utils/request';
import { stringify } from 'qs';
import { server, cacheManager } from '../utils/utils';
import moment from 'moment'
import { message } from 'antd'

export async function query() {
    //   return request('/api/users');
    return [{
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    }, {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    }, {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
    }]
}

export async function queryCurrent() {
    // return request('/api/currentUser');
    return {
        name: cacheManager.get('ellahome_customerName'),
        // avatar: logo,
        userid: cacheManager.get('ellahome_token'),
    }
}

export async function getPersonalMenu(payload) {

    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.selectUserMenu&content=' + JSON.stringify(payload),
    }).then(res => {
        return res.data;
    }).catch(err => {
        console.error(err)
    });

}
