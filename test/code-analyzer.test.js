import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

let x = `function foo(x, y, z){
    let a = x + 1;
    let b = a + y;
    let c = 0;
    
    if (b < z) {
        c = c + 5;
        return x + y + z + c;
    } else if (b < z * 2) {
        c = c + x + 5;
        return x + y + z + c;
    } else {
        c = c + z + 5;
        return x + y + z + c;
    }
}
`;
let x2 = `function foo(x, y, z){
    let a = x + 1;
    let b = a + y;
    let c = 0;
    
    if (b > z) {
        c = c + 5;
        return x + y + z + c;
    } else if (b < z * 2) {
        c = c + x + 5;
        return x + y + z + c;
    } else {
        c = c + z + 5;
        return x + y + z + c;
    }
}
`;
let z = `function foo(x, y, z){
    let a = x + 1;
    let b = a + y;
    let c = 0;
    
    while (a < z) {
        c = a + b;
        z = c * 2;
    }
    
    return z;
}
`;
let y = '{x:3, y:5, z:6}';
let p = parseCode(x, y);
let t = parseCode(z, y);
let q = parseCode(x2, y);
describe('The javascript parser', () => {
    it('check length of p array', () => {
        assert.equal(p.length, 76);});
    it('check length of p array', () => {
        assert.equal(t.length, 76);}); 
    it('check t first line1', () => {
        assert.equal(t[0].line, 'function foo(x, y, z){');}); 
    it('check t first line2', () => {
        assert.equal(t[0].color, 1);}); 
    it('check p first line2 color', () => {
        assert.equal(p[2].color, 3);}); 
    it('check p first line2 line', () => {
        assert.equal(p[1].color, 1);}); 
    it('check p first line6 color', () => {
        assert.equal(p[6].color, 1);}); 
    it('check p first line7 line', () => {
        assert.equal(t[7].line, 'return x + y + z + 0 + z + 5;');});
});

describe('The javascript parser', () => {
    it('check t first line1', () => {
        assert.equal(t[0].line, 'function foo(x, y, z){');}); 
    it('check t first line2', () => {
        assert.equal(t[0].color, 1);}); 
    it('check p first line2 color', () => {
        assert.equal(p[2].color, 3);}); 
    it('check p first line2 line', () => {
        assert.equal(q[1].color, 1);}); 
    it('check p first line6 color', () => {
        assert.equal(p[6].line, '    } else {');}); 
    it('check p first line7 line', () => {
        assert.equal(t[7].line, 'return x + y + z + 0 + z + 5;');});
});
