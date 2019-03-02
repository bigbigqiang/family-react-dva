import React, { PureComponent } from 'react';
import {
    Layout,
    Row,
    Col,
    Input,
    Button,
    Modal,
    Icon,
    Table,
    Pagination,
    Popconfirm,
    Breadcrumb,
    DatePicker,
    Menu,
    Form,
    Affix
} from "antd";
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape } from "bizcharts";
import {DataSet} from '@antv/data-set';
import moment from "moment";
import styles from './index.less';


const { Item: FormItem } = Form;

@Form.create()
export default class AddUser extends PureComponent {

    state = {
        showEditor: false,
        nowStudent: {}
    }

    render() {
        const { visible,   teacherData } = this.props;
        const addTeacher= _.get(teacherData,'[0].addTeacher','0');
        const addParent= _.get(teacherData,'[0].addParent','0');
        const addKindergarten= _.get(teacherData,'[0].addKindergarten','0');
        const addClass= _.get(teacherData,'[0].addClass','0');
        const addUser= _.get(teacherData,'[0].addUser','0');
        const newTime=_.get(teacherData,'[0].statisticalDate',moment());
        const { DataView } = DataSet;
        const dv = new DataView();
        const { Html } = Guide;
        const data = [
            { item: "教师", count: addTeacher },
            { item: "家长", count: addParent }

        ];
        dv.source(data).transform({
            type: "percent",
            field: "count",
            dimension: "item",
            as: "percent"
        });
        const cols = {
            percent: {
                formatter: val => {
                    val = (val * addUser);
                    let vals=parseInt(val);
                    return vals;
                }
            }
        };

        return (
            <Row className={styles.chart} style={{ display: visible }}>
                <Chart height={400} data={dv} scale={cols} padding={[80, 100, 80, 80]} className={styles.charts}>
                    <Coord type='theta' radius={0.75}/>
                    <Axis name="percent"/>
                    <Legend position='right' offsetY={-window.innerHeight / 2 + 300} offsetX={-100}/>
                    <Tooltip
                        showTitle={false}
                        itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
                    />
                    <Geom
                        type="intervalStack"
                        position="percent"
                        color='item'
                        tooltip={["item*percent", (item, percent) => {
                            percent = percent * addUser;
                           let  percents=parseInt(percent);
                            return {
                                name: item,
                                value: percents
                            };


                        }]}
                        style={{ lineWidth: 1, stroke: "#fff" }}
                    >
                        <Label content='percent' offset={-40} textStyle={{
                            rotate: 0,
                            textAlign: "center",
                            shadowBlur: 2,
                            shadowColor: "rgba(0, 0, 0, .45)"
                        }}/>
                    </Geom>
                </Chart>
                <div style={{ position: "absolute", top: 110, left: 70}}>
                    <div className={styles.lastDay}>
                        <span>{moment(newTime).format("YYYY-MM-DD")}</span>
                    </div>

                </div>
                <div style={{ position: "absolute", top: 110, left: 500}}>
                    <div className={styles.totalPerson}>
                        <span>新增用户</span><span>{addUser}人</span>
                    </div>
                    <div className={styles.totalContent}>
                        <div className={styles.kidGarden}>
                            <span>幼儿园</span><br/><span className={styles.totalClass}>{addKindergarten}</span><span>家</span>
                        </div>
                        <div className={styles.kidGarden}>
                            <span>班级</span><br/><span className={styles.totalClass}>{addClass}</span><span>个</span>
                        </div>
                    </div>
                </div>
            </Row>
        )
    }
}