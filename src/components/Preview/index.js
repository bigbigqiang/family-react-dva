import React from 'react';
import { Carousel,List,Row,Col } from 'antd';
import { connect } from 'dva';
import previewBg from '../../assets/images/preview.png';
import previewBottom from '../../assets/images/previewbottom.jpg';
import classIcon from '../../assets/images/classicon.png';
import styles from './index.less';

@connect(state => ({
    appindex: state.appindex
}))
export default class Preview extends React.Component {
    state = {

    }
    componentDidMount(){

    }
    previewDataChk=(item,index)=>{
        switch (item.partType){
            case 'BANNER':
                let bannerList=item.bannerList?item.bannerList:[];
                return (
                        <Carousel key={index}>
                            {
                                bannerList.map((item,index)=>{
                                    return (<div key={index}><img className={styles.bannerimg} src={item.bannerImageUrl} alt={item.bannerTitle}/></div>)
                                })
                            }
                        </Carousel>
                )
            case 'WIKI':
                let wikiList=item.wikiList?item.wikiList:[];
                return (
                        <Row key={index}>
                            {
                                wikiList.map((item,index)=>{
                                    let itemU=item.iconUrl+"";
                                    let iconUrl=itemU.indexOf('http')!='-1'?itemU:classIcon;
                                    return (
                                        <Col span={6} key={index}><img className={styles.classimg} src={iconUrl} alt={item.wikiName}/></Col>
                                    )
                                })
                            }
                        </Row>
                )
            case 'SUBJECT':
                let subjectDetails=item.subjectDetails?item.subjectDetails:[];
                return (
                    <div style={{background:'white'}} key={index}>
                        <div className={styles.partTitlebg}>
                            <span className={styles.partTitle}>{item.partTitle}</span>
                            <span className={styles.more}>更多</span>
                        </div>
                        <div className={styles.mdMargin}>
                            <img className={styles.freeimg} src={subjectDetails.topicImg} />
                            <div className={styles.font2}>{subjectDetails.topicTitle}</div>
                            <div className={styles.font}>{subjectDetails.topicSubTitle}</div>
                        </div>
                    </div>
                )
            case 'FREE':
                let bookList=item.bookList?item.bookList:[];
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
                                    <img className={styles.freeimg} src={item.coverUrl} />
                                    <span className={styles.booknamefont}>{item.bookName}</span>
                                </div>
                            </List.Item>
                            )}
                        />
                    </div>
                )
            case 'AD':
                return (
                    <div className={styles.admain} key={index}>
                        <img className={styles.adimg} src={item.adDetails.imageUrl}/>
                    </div>
                )
            case 'CUSTOM':
                switch (item.partStyle){
                    case 'IMAGE_TEXT':
                    return (
                        <div style={{background:'white'}} key={index}>
                            <div className={styles.partTitlebg}>
                                <span className={styles.partTitle}>{item.partTitle}</span>
                                <span className={styles.more}>更多</span>
                            </div>
                            <div className={styles.slidebg}>
                                <div className={styles.slidehorizontal} style={{width:item.bookList.length*200+'px'}}>
                                    {
                                        item.bookList.map((item,index)=>{
                                            return (
                                                <div className={styles.item2} key={index}>
                                                    <Row>
                                                        <Col span={8}>
                                                            <img className={styles.freeimg} src={item.coverUrl} />
                                                        </Col>
                                                        <Col span={16} style={{position:'relative'}}>
                                                            <p className={styles.item2title}>{item.bookName}</p>
                                                            <div className={styles.item2desc}><span>{item.bookIntroduction}</span></div>
                                                            {/* <div className={styles.item2desc}>{item.bookIntroduction}</div> */}
                                                            <span className={styles.item2all}>阅读全文 ></span>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    );
                    case 'SLIDE_PORTRAIT':
                        return (
                            <div style={{background:'white'}} key={index}>
                                <div className={styles.partTitlebg}>
                                    <span className={styles.partTitle}>{item.partTitle}</span>
                                    <span className={styles.more}>更多</span>
                                </div>
                                <List
                                    grid={{gutter:12, column: 3 }}
                                    dataSource={item.bookList}
                                    className={styles.mdMargin}
                                    renderItem={item => (
                                    <List.Item>
                                        <div>
                                            <img className={styles.freeimg} src={item.coverUrl} />
                                            <span className={styles.booknamefont}>{item.bookName}</span>
                                        </div>
                                    </List.Item>
                                    )}
                                />
                            </div>
                        );
                    case 'SLIDE_HORIZONTAL':
                        return (
                            <div style={{background:'white'}} key={index}>
                                <div className={styles.partTitlebg}>
                                    <span className={styles.partTitle}>{item.partTitle}</span>
                                    <span className={styles.more}>更多</span>
                                </div>
                                <div className={styles.slidebg}>
                                    <div className={styles.slidehorizontal} style={{width:item.bookList.length*90+'px'}}>
                                        {
                                            item.bookList.map((item,index)=>{
                                                return (
                                                    <div className={styles.item} key={index}>
                                                        <img className={styles.freeimg} src={item.coverUrl} />
                                                        <span className={styles.booknamefont}>{item.bookName}</span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        );
                }
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