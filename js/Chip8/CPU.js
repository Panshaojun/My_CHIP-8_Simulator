export default class{
    constructor(){
        this.V = new Uint8Array(16);//16个数据寄存器，V0~VF，
        this.I = 0;//地址寄存器
        this.pc = 0x200;//CHIP8的程序都是从0x200地址开始的
        this.stack = new Array;//堆栈指针
        this.delayTimer = 0;//延时计时器，60hz
        this.soundTimer = 0;//声音计时器，60hz
    }
    
    updateTimers() {
        if (this.delayTimer > 0) this.delayTimer -= 1;//递减至0，至0触发延时事件
        if (this.soundTimer > 0) this.soundTimer -= 1;//递减至0，至0触发声音事件
    }  
}
