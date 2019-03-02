import { PureComponent } from 'react';

export default class ImgPreview extends PureComponent {

    state = {
        preview: false,
        initialStyles: {
            maxWidth: '100%',
            maxHeight: '600px',
        },
        styles: {}
    }

    render() {
        return (
            <div>
                <img src={this.props.src} style={{ ...this.state.initialStyles, ...this.state.styles }} onClick={() => {

                    this.state.preview = !this.state.preview;

                    if (this.state.preview) {
                        this.setState({
                            styles: {
                                maxWidth: '96%',
                                maxHeight: '96%',
                                position: 'fixed',
                                zIndex: 1001,
                                left: '50%',
                                top: '50%',
                                transform: 'translate3D(-50%,-50%,0)'
                            }
                        })
                    } else {
                        this.setState({
                            styles: {}
                        })
                    }

                }} alt="" />
                <div className="modal" style={{
                    position: 'fixed',
                    zIndex: 1000,
                    left: 0,
                    top: 0,
                    background: 'rgba(0,0,0,0.6)',
                    width: '100%',
                    height: '100%',
                    display: this.state.preview ? 'block' : 'none'
                }}></div>
            </div>
        )
    }
}
