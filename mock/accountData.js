import faker from 'faker';
faker.locale = 'zh_CN';

const accountData = [];
for (let index = 1; index <= 50; index++) {
    accountData.push(
        {
            key: index,
            contract_party: faker.name.findName(),
            partner_type: ['合伙人', '教育机构'][~~(Math.random() * 2)],
            phonenumber: '13700000000',
            geo_location: '浙江-宁波',
            kinder_garden_count: '6',
            status: '正常',
            add_time: '1514603032908',
            modified_time: '1514597267029'
        }
    )
}
export default {
    accountData,
}