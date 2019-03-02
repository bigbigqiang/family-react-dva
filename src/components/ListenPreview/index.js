/**
 * Created by Zhaoyue on 2018/11/9
 */
import React from 'react';
import { Carousel,List,Row,Col } from 'antd';
import { connect } from 'dva';
import previewBg from '../../assets/images/preview.png';
import previewBottom from '../../assets/images/previewbottom.jpg';
import classIcon from '../../assets/images/classicon.png';
import styles from './index.less';

@connect(state => ({
    listenindex: state.listenindex
}))
export default class ListenPreview extends React.Component {
    state = {

    }
    componentDidMount(){

    }
    previewDataChk=(item,index)=>{
        switch (item.partType){
            case 'WIKI':
                let wikiList=item.sorts?item.sorts:[];
                return (
                    <Row key={index}>
                        {
                            wikiList.map((item,index)=>{
                                let itemU=item.imageUrl+"";
                                let iconUrl=itemU.indexOf('http')!='-1'?itemU:classIcon;
                                return (
                                    <Col span={6} key={index}><img className={styles.classimg} src={iconUrl} alt={item.sortTitle}/></Col>
                                )
                            })
                        }
                    </Row>
                )

            case 'LISTEN_LIST':
                let bookList=item.listenDto?item.listenDto.listenDetails:[];
                return (
                    <div style={{background:'white'}} key={index}>
                        <div className={styles.partTitlebg}>
                            <span className={styles.partTitle}>{item.partTitle}</span>
                            <span className={styles.more}>更多</span>
                        </div>
                        <List
                            grid={{gutter:12, column: 3 }}
                            dataSource={bookList}
                            className={styles.mdMargin}
                            renderItem={item => (
                                <List.Item>
                                    <div>
                                        <img className={styles.freeimg} src={item.bookOssUrl} />
                                        <span className={styles.booknamefont}>{item.audioName}</span>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>
                )
            case 'AD':
                return (
                    <div className={styles.admain} key={index}>
                        <img className={styles.adimg} src={item.ads.imageUrl}/>
                    </div>
                )

            default:
                break;
        }
    }
    render() {
        const { previewData } = this.props;
        return (
            <div className={styles.phonebd}>
                <img src={previewBg} className={styles.previewbg}/>
                <div className={styles.phoneIndex}>
                    <div className={styles.phoneMain}>
                        {
                            previewData?previewData.map(this.previewDataChk):''

                        }
                        <img style={{width:'300px',marginRight:'20px',position: 'absolute',left:0,bottom:0}} src={previewBottom} />
                    </div>
                </div>
            </div>
        )
    }
}
