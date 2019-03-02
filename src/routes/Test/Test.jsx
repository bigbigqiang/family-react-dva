import React, { Component } from 'react';
import { connect } from 'dva';
import { DatePicker } from 'antd';
import styles from './Test.less';
import moment from 'moment';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

@connect(state => ({
    test: state.test
}))
export default class Test extends Component {

    render() {

        return (
            <div>
                <WeekPicker></WeekPicker>
            </div>
        );
    }
}
