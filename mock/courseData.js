import faker from 'faker';

const courseData = [
    {
        course_id: '1786',
        course_title: '葫芦娃',
        has_plan: false,
        lesson_plan: null,
    }, {
        course_id: '1788',
        course_title: '黑猫警长',
        has_plan: false,
        lesson_plan: null,
    }, {

    }, {

    }, {

    }, {

    }, {

    }, {

    }, {

    }, {

    }, {

    }, {

    }, {

    }, {

    }, {

    }, {

    }
]

const bookData = [];
for (let index = 0; index < 20; index++) {
    bookData.push(
        {
            key: index + '',
            book_name: `《${faker.lorem.slug()}》`,
            stack_time: '2017-10-18',
            book_status: '已上架'
        }
    )
}

const planData = {
    teach_aim: faker.lorem.sentence(),
    teach_extend: faker.lorem.sentence(),
    teach_flow: faker.lorem.sentence(),
    teach_prepare: faker.lorem.sentence(),
}

export default {
    courseData,
    bookData,
    planData
}