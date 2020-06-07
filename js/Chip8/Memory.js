export default class {
    constructor() {
        this.RAM = new Uint8Array(1024 * 4);
        this.Backups = new Uint8Array(1024 * 4);
        this.loadFonts();
    }

    loadRom(buffer) {
        for (let i = 0, len = buffer.length; i < len; i++) {
            this.RAM[0x200 + i] = this.Backups[0x200 + i] = buffer[i];
        }
    }

    resetRAM() {
        for (let i = 0, len = this.Backups.length; i < len; i++) {
            this.RAM[i] = this.Backups[i];
        }
    }

    loadFonts() {
        //默认字体
        let fonts = [
            /* 
            举例这个0，对应的5个十六进制换算成二进制有：
            11110000      * * * *
            10010000      *     *
            10010000  =>  *     *
            10010000      *     *
            11110000      * * * *
            */
            0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
            0x20, 0x60, 0x20, 0x20, 0x70, // 1
            0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
            0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
            0x90, 0x90, 0xF0, 0x10, 0x10, // 4
            0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
            0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
            0xF0, 0x10, 0x20, 0x40, 0x40, // 7
            0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
            0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
            0xF0, 0x90, 0xF0, 0x90, 0x90, // A
            0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
            0xF0, 0x80, 0x80, 0x80, 0xF0, // C
            0xE0, 0x90, 0x90, 0x90, 0xE0, // D
            0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
            0xF0, 0x80, 0xF0, 0x80, 0x80  // F
        ];
        for (let i = 0, len = fonts.length; i < len; i++) {
            this.RAM[i] = this.Backups[i] = fonts[i];
        }
    }

}