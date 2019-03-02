import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Button, Icon, Modal, Tag } from 'antd';
import { G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape, Facet, Util } from "bizcharts";
import DataSet from "@antv/data-set";
import { dict } from '../../utils/dict';
import styles from './Information.less';
import moment from 'moment';

export default class PieChart extends Component {

    constructor() {
        super();
        this.state = {
            visible: false
        }
    }

    componentDidMount() {

    }

    render() {

        const { DataView } = DataSet;
        const data = this.props.data;
        const dv = new DataView();
        dv.source(data).transform({
            type: "percent",
            field: "count",
            dimension: "item",
            as: "percent"
        });
        const cols = {
            percent: {
                formatter: val => {
                    val = (val * 100).toFixed(2) + "%";
                    return val;
                }
            }
        };
        return (
            <div style={{ width: 400 }}>
                <Chart
                    height={300}
                    width={400}
                    // style={{ position: 'relative' }}
                    data={dv}
                    scale={cols}
                    padding={[10, 10, 10, 10]}
                    forceFit
                >
                    <Coord type="theta" radius={0.75} />
                    <Axis name="percent" />
                    <Legend
                        position="right"
                        offsetY={-80}
                        offsetX={-80}
                    />
                    <Tooltip
                        showTitle={false}
                        itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                    />
                    <Geom
                        type="intervalStack"
                        position="percent"
                        color="item"
                        tooltip={[
                            "item*percent",
                            (item, percent) => {
                                percent = (percent * 100).toFixed(2) + "%";
                                return {
                                    name: item,
                                    value: percent
                                };
                            }
                        ]}
                        style={{
                            lineWidth: 1,
                            stroke: "#fff"
                        }}
                    >
                        <Label
                            content="percent"
                            offset={-40}
                            textStyle={{
                                rotate: 0,
                                textAlign: "center",
                                shadowBlur: 2,
                                shadowColor: "rgba(0, 0, 0, .45)"
                            }}
                        />
                    </Geom>
                </Chart>
            </div>
        )
    }
}
