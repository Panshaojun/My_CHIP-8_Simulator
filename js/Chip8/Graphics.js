/* 
显卡
*/
export default class {
    constructor() {
        this.data = new Array(64 * 32);//保存图像像素数据
        this.display = null;//显示器
    }

    setDisplay(display) {
        this.display = display;
    }

    clear() {//清屏
        this.data = new Array(64 * 32);
    }

    setData(x, y) {//设置单个像素
        let p = x + y * 64;
        this.data[p] = this.data[p] ^ 1;//CHI-8采用异或进行绘制
        return !this.data[p];
    }

    render() {
        this.display.clearRect(0, 0, 320, 160);
        this.display.fillStyle = "white";
        for (let row = 0; row < 32; row++) {
            for (let col = 0; col < 64; col++) {
                this.data[row * 64 + col] ? this.display.fillRect(col * 5, row * 5, 5, 5) : null;
            }
        }
    }
}