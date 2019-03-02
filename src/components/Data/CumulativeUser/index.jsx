import React, { PureComponent } from 'react';
import {
    Row,
    Form,
    Affix,
    Card
} from "antd";
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape } from "bizcharts";
import { DataSet } from '@antv/data-set';
import moment from "moment";
import styles from './index.less';

@Form.create()
export default class CumulativeUser extends PureComponent {

    state = {
        showEditor: false,
        nowStudent: {}
    }

    render() {
        const { visible,   teacherData } = this.props;
        const cumulativeTeacher = _.get(teacherData,'[0].cumulativeTeacher','0');
        const cumulativeParent = _.get(teacherData,'[0].cumulativeParent','0');
        const cumulativeKindergarten = _.get(teacherData,'[0].cumulativeKindergarten','0');
        const cumulativeClass = _.get(teacherData,'[0].cumulativeClass','0');
        const newTime=_.get(teacherData,'[0].statisticalDate',moment());
        const cumulativeUser = _.get(teacherData,'[0].cumulativeUser','0');
        const { DataView } = DataSet;
        const dv = new DataView();
        const { Html } = Guide;
        const data = [
            { item: "教师", count: cumulativeTeacher },
            { item: "家长", count: cumulativeParent }
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
                    val = (val * cumulativeUser);
                    let vals=parseInt(val);
                    return vals;
                }
            }
        };



        return (
            <Row className={styles.chart} style={{ display: visible }}>
                <Chart height={400} data={dv} scale={cols} padding={[80, 100, 80, 80]} className={styles.charts}>
                    <Coord type='theta' radius={0.75} />
                    <Axis name="percent" />
                    <Legend position='right' offsetY={-window.innerHeight / 2 + 300} offsetX={-100} />
                    <Tooltip
                        showTitle={false}
                        itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
                    />
                    <Geom
                        type="intervalStack"
                        position="percent"
                        color='item'
                        tooltip={["item*percent", (item, percent) => {
                            percent = percent * cumulativeUser;
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
                        }} />
                    </Geom>
                </Chart>
                <div style={{ position: "absolute", top: 110, left: 70 }}>
                    <div className={styles.lastDay}>
                        <span>{moment(newTime).format("YYYY-MM-DD")}</span>
                    </div>
                </div>
                <div style={{ position: "absolute", top: 110, left: 500 }}>
                    <div className={styles.totalPerson}>
                        <span>累计用户</span><span>{cumulativeUser}人</span>
                    </div>
                    <div className={styles.totalContent}>
                        <div className={styles.kidGarden}>
                            <span>幼儿园</span><br /><span className={styles.totalClass}>{cumulativeKindergarten}</span><span>家</span>
                        </div>
                        <div className={styles.kidGarden}>
                            <span>班级</span><br /><span className={styles.totalClass}>{cumulativeClass}</span><span>个</span>
                        </div>
                    </div>
                </div>
            </Row>
        )
    }
}