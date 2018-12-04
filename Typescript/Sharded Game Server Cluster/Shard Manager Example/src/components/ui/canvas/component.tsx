import * as React from 'react';

export class Canvas extends React.Component<React.CanvasHTMLAttributes<HTMLCanvasElement> & { refOfCanvas?: (element: HTMLCanvasElement) => void }> {

    componentWillMount() {
        window.onresize = this.onWindowResize;
    }

    onWindowResize = (_: UIEvent) => {
        this.forceUpdate();
    };

    render() {
        const props = {
            ...this.props,
            ref: this.props.refOfCanvas
        }
        delete props.refOfCanvas;
        return <div className="canvasContainer">
            <canvas {...props} width={window.innerWidth} height={window.innerHeight} />
        </div>
    }
}