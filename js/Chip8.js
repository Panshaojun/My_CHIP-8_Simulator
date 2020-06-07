import CPU from './Chip8/CPU.js'
import Graphics from './Chip8/Graphics.js'
import Memory from './Chip8/Memory.js'
import {Input} from './Chip8/Input.js'

window.addEventListener("keydown", Input.keyDown, false);//绑定键盘按下时间
window.addEventListener("keyup", Input.keyUp, false);//绑定键盘弹起时间

export default class{
    constructor(){
        this.CPU=new CPU();
        this.Graphics=new Graphics();
        this.Memory=new Memory();
        this.paused=false;
    }

    main(){
        //CPU工作
        if (!this.paused) {
            let i=10;
            while(i--){
                let opcode=this.Memory.RAM[this.CPU.pc] <<8 | this.Memory.RAM[this.CPU.pc+1];
                this.parseOpcode(opcode);
            }
            this.CPU.updateTimers();
        }
        //显卡渲染
        this.Graphics.render();
    }

    //解析操作码
    parseOpcode(opcode) {
        this.CPU.pc += 2;
        let x = (opcode & 0x0F00) >> 8;
        let y = (opcode & 0x00F0) >> 4;
        let NNN = opcode & 0x0FFF;
        let NN = opcode & 0x00FF;
        let CPU = this.CPU;
        let Graphics = this.Graphics;
        let Memory = this.Memory;

        ({
            0x0000() {
                ({
                    0x00E0() {
                        Graphics.clear();
                    },
                    0x00EE() {
                        CPU.pc = CPU.stack.pop();
                    }
                })[NN]();
            },
            0x1000() {
                CPU.pc = NNN;
            },
            0x2000() {
                CPU.stack.push(CPU.pc);
                CPU.pc = NNN;
            },
            0x3000() {
                if (CPU.V[x] == NN) CPU.pc += 2;
            },
            0x4000() {
                if (CPU.V[x] != NN) CPU.pc += 2;
            },
            0x5000() {
                if (CPU.V[x] == CPU.V[y]) CPU.pc += 2;
            },
            0x6000() {
                CPU.V[x] = NN;
            },
            0x7000() {
                CPU.V[x] += NN;
            },
            0x8000() {
                ({
                    0x0000() {
                        CPU.V[x] = CPU.V[y];
                    },
                    0x0001() {
                        CPU.V[x] = CPU.V[x] | CPU.V[y];
                    },
                    0x0002() {
                        CPU.V[x] = CPU.V[x] & CPU.V[y];
                    },
                    0x0003() {
                        CPU.V[x] = CPU.V[x] ^ CPU.V[y];
                    },
                    0x0004() {
                        let sum = CPU.V[x] + CPU.V[y];
                        CPU.V[0xF] = sum > 0xFF?1:0;
                        CPU.V[x] = sum;
                    },
                    0x0005() {
                        CPU.V[0xF] = CPU.V[x] > CPU.V[y]?1:0;
                        CPU.V[x] = CPU.V[x] - CPU.V[y];
                    },
                    0x0006() {
                        CPU.V[0xF] = CPU.V[x] & 0x01;
                        CPU.V[x] = CPU.V[x] >> 1;
                    },
                    0x0007() {
                        CPU.V[0xF] = CPU.V[x] > CPU.V[y]?0:1;
                        CPU.V[x] = CPU.V[y] - CPU.V[x];
                    },
                    0x000E() {
                        CPU.V[0xF] = CPU.V[x] & 0x80;
                        CPU.V[x] = CPU.V[x] << 1;
                    }
                })[opcode & 0x000F]();
            },
            0x9000() {
                if (CPU.V[x] != CPU.V[y]) CPU.pc += 2;
            },
            0xA000() {
                CPU.I = NNN;
            },
            0xB000() {
                CPU.pc = NNN + CPU.V[0];
            },
            0xC000() {
                CPU.V[x] = Math.floor(Math.random() * 0xFF) & NN;
            },
            0xD000() {
                // Drawing Sprites to the Screen 在屏幕上绘制小精灵
                // 小精灵sprites，维基百科上的解释是子图形的简称，了解即可
                // CHIP-8小精灵宽度始终为8个像素（一个字节），且高度为1到15个像素之间。
                let sprite; 
                let h=opcode & 0x000F;//小精灵高度==>得到小精灵图案 8*h
                CPU.V[0xF] = 0;
                while(h--){
                    sprite= Memory.RAM[CPU.I + h];//自底向上绘制小精灵,取得一行数据
                    for(let i=0;i<8;i++){
                        if((sprite & 0x80) >0){
                            if(Graphics.setData(CPU.V[x]+i , CPU.V[y]+h))CPU.V[0xF]=1;
                        }
                        sprite = sprite << 1;
                    }
                }  
            },
            0xE000() {
                ({
                    0x009E() {
                        if (Input.isKeyPressed(CPU.V[x])) CPU.pc += 2;
                    },
                    0x00A1() {
                        if (!Input.isKeyPressed(CPU.V[x])) CPU.pc += 2;
                    }
                })[NN]();
            },
            0xF000() {
                ({
                    0x0007() {
                        CPU.V[x] = CPU.delayTimer;
                    },
                    0x000A() {
                        // CPU.paused = true;
                        Input.onNextKeyPress = function (key) {
                            CPU.V[x] = key;
                            // CPU.paused = false;
                        };
                    },                          
                    0x0015() {
                        CPU.delayTimer = CPU.V[x];
                    },
                    0x0018() {
                        CPU.soundTimer = CPU.V[x];
                    },
                    0x001E() {
                        CPU.I += CPU.V[x];
                    },
                    0x0029() {
                        CPU.I = CPU.V[x] * 5;
                    },	
                    0x0033() {
                        Memory.RAM[CPU.I] = parseInt(CPU.V[x] / 100);//取得十进制百位
                        Memory.RAM[CPU.I + 1] = parseInt(CPU.V[x] % 100 / 10);//取得十进制十位
                        Memory.RAM[CPU.I + 2] = CPU.V[x] % 10;//取得十进制个位
                    },
                    0x0055() {
                        for (let i = 0; i <= x; i++) {
                            Memory.RAM[CPU.I + i] = CPU.V[i];
                        }
                    },
                    0x0065() {
                        for (let i = 0; i <= x; i++) {
                            CPU.V[i] = Memory.RAM[CPU.I + i];
                        }
                    }
                })[NN]();
            }
        })[opcode & 0xF000]();
    }
}