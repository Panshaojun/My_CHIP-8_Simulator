/* 
*输入
*/
export class Input{
    //按钮映射
    static MAPPING = {
        0x1: "1",
        0x2: "&",//上
        0x3: "3",
        0xC: "4",
        0x4: "%",//左
        0x5: "W",
        0x6: "'",//右
        0xD: "R",
        0x7: "A",
        0x8: "(",//下
        0x9: "D",
        0xE: "F",
        0xA: "Z",
        0x0: "X",
        0xB: "C",
        0xF: "V"
    }
    static keysPressed=[];

    static clear(){
        Input.keysPressed = [];
    }

    static isKeyPressed(property) {
        let key = Input.MAPPING[property];
        return !!Input.keysPressed[key];
    }
    static onNextKeyPress(){

    }

    static keyDown(event) {
        let key = String.fromCharCode(event.which);
        Input.keysPressed[key] = true;
        for (let property in Input.MAPPING) {
            let keyCode = Input.MAPPING[property];
            if (keyCode == key) {
                try {
                    Input.onNextKeyPress(parseInt(property), keyCode);
                } finally {
                    Input.onNextKeyPress = function () { }
                }
            }
        }
    }
    
    static keyUp(event) {
        let key = String.fromCharCode(event.which);
        Input.keysPressed[key] = false;
    }
}