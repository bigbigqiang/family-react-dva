import faker from 'faker';
import * as _ from 'lodash';

/**
 * status: 0-已下线 1-草稿 2-已发布
 */
const bannerList = _.times(20, function (index) {
    return {
        key: index,
        device: _.sample([0, 1]),
        banner_title: faker.lorem.slug(),
        modify_time: '2017-10-8',
        status: _.sample([0, 1, 2]),
    }
})

export default {
    bannerList,
}