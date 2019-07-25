function init (_num) {
    // 获取浏览器窗口的宽高，后续会用
    let width = window.innerWidth;
    let height = window.innerHeight;
    // 创建一个场景
    let scene = new THREE.Scene();
    // 创建一个具有透视效果的摄像机
    let camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 800);
    // 设置摄像机位置，并将其朝向场景中心
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 20;
    camera.lookAt(scene.position);
    // 创建一个 WebGL 渲染器，Three.js 还提供 <canvas>, <svg>, CSS3D 渲染器。
    let renderer = new THREE.WebGLRenderer();
    // 设置渲染器的清除颜色（即背景色）和尺寸。
    // 若想用 body 作为背景，则可以不设置 clearColor，然后在创建渲染器时设置 alpha: true，即 new THREE.WebGLRenderer({ alpha: true })
    renderer.setClearColor(0xffffff);
    renderer.setSize(width, height);

    let wall = new THREE.TextureLoader().load('wall.jpg');
    let wall_short = new THREE.TextureLoader().load('wall_short.jpg');
    let grid = document.getElementsByClassName('grid');
    
    // 创建材质（该材质不受光源影响）
    let cubeMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.5
    })

    // 创建一个立方体（几何体）
    function createBox(_x,_y,_z,_l,_w,_h,_rotation){

        let materialArr = [
            //纹理对象赋值给6个材质对象
            new THREE.MeshBasicMaterial({map:wall_short}),//左
            new THREE.MeshBasicMaterial({map:wall_short}),//右
            new THREE.MeshBasicMaterial({map:wall_short}),//上或下
            new THREE.MeshBasicMaterial({map:wall_short}),//上或下
            new THREE.MeshBasicMaterial({map:wall}),//前
            new THREE.MeshBasicMaterial({map:wall})//後
        ];
    
        let facematerial = new THREE.MeshFaceMaterial(materialArr);
        let cubeGeometry = new THREE.BoxGeometry(_l,_w,_h);
        // 创建一个立方体网格（mesh）：将材质包裹在几何体上
        let cube = new THREE.Mesh(cubeGeometry, facematerial);
        // 设置网格的位置
        if(_rotation){
            cube.rotation.y = _rotation * Math.PI / 180;
        }
            cube.position.x = _x;
            cube.position.y = _y;
            cube.position.z = _z;
            // 将立方体网格加入到场景中
            scene.add(cube);
    }

        //地板
        var geometry = new THREE.PlaneGeometry(100,100);
        var material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide} );
        var floor = new THREE.Mesh( geometry, material );
        floor.position.x = 45;
        floor.position.y = -5;
        floor.position.z = 45;
        floor.rotation.x = 90 * Math.PI / 180;
        scene.add( floor );
        var ceiling = new THREE.Mesh( geometry, material );
        ceiling.position.x = 45;
        ceiling.position.y = 5;
        ceiling.position.z = 45;
        ceiling.rotation.x = 90 * Math.PI / 180;
        scene.add( ceiling );

        // 将渲染器的输出（此处是 canvas 元素）插入到 body 中
        document.body.appendChild(renderer.domElement);
        let _l=2,_w=10,_h=10;
        for(let z=0;z<10;z++){
            for(let x=0;x<10;x++){
                let run = z*10 + x;
                let count = 0;
                if(grid[run].style.borderRight  !== 'none' ){
                    createBox(x*_w+(_w/2),0,z*_h        ,_h,_w,_l,90);
                    count++;
                }
                if(grid[run].style.borderLeft   !== 'none' ){
                    createBox(x*_w-(_w/2),0,z*_h        ,_h,_w,_l,90);
                    count++;
                }
                if(grid[run].style.borderTop    !== 'none' ){
                    createBox(x*_w      ,0,z*_h -(_h/2) ,_h,_w,_l,0);
                }
                if(grid[run].style.borderBottom  !== 'none' ){
                    createBox(x*_w      ,0,z*_h + (_h/2),_h,_w,_l,0);
                }
            }
        }
    
    function render(){ // 渲染，即摄像机拍下此刻的场景
        renderer.render(scene, camera);
    }
    render();
    
    let angle = parseInt(_num % 10) * 10;
    let targetAngle = parseInt(_num/10) * 10;
    let targetX = parseInt(_num % 10) * 10;
    let targetZ = parseInt(_num/10) * 10;
    let X=0;
    let Z=0;

    camera.position.z = targetZ;
    camera.position.x = targetX;

    document.addEventListener('keydown', function (e) {
        if(targetAngle!==angle || targetX!==X || targetZ!==Z){return;}
        var key = e.which || e.keyCode;
        switch (key) {
            case 87://w
            case 38://up
                switch(angle%360){
                    case 0:
                        targetZ -= 10;
                        break;
                    case 90:
                    case -270:
                        targetX -= 10;
                        break;
                    case 180:
                    case -180:
                        targetZ += 10;
                        break;
                    case 270:
                    case -90:
                        targetX += 10;
                        break;
                    default:
                        break;
                }
                break;
            case 65://a
            case 37://left
                targetAngle+=90;
                break;
            case 68://d
            case 39://right
                targetAngle-=90;
                break;
            case 83://s
            case 40://down
                switch(angle%360){
                    case 0:
                        targetZ += 10;
                        break;
                    case 90:
                    case -270:
                        targetX += 10;
                        break;
                    case 180:
                    case -180:
                        targetZ -= 10;
                        break;
                    case 270:
                    case -90:
                        targetX -= 10;
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    });

    function animationRender() {
        if(targetAngle!==angle){
            angle = (targetAngle > angle)? angle+1.5 : angle-1.5;
            camera.rotation.y = angle * Math.PI / 180;
        }
        if(targetX !== X){
            X = (targetX > X)? X+1 : X-1;
            camera.position.x = X;
        }
        if(targetZ !== Z){
            Z = (targetZ > Z)? Z+1 : Z-1;
            camera.position.z = Z;
        }
        
        render();
        requestAnimationFrame(animationRender);
    }
    animationRender();
}


let Kruskal = function(){
    let self = this;
    self.main = document.getElementsByClassName('main')[0];
    self.w = 10; 
    self.h = 10; 
    self.i = 0;
    self.playerPos;
    self.direction = 0;
    self.directionList = ['up','rigth','down','left']
    self.player = document.createElement('div');
    
    self.getRandom = function(min,max){
        return parseInt(Math.random()* (max - min + 1 ))+min;
    };

    self.init = function(){
        for(let y = 0;y<self.h;y++){
            for(let x = 0;x<self.w;x++){
                let div = document.createElement("div");
                div.style.top =  y*60 +'px';
                div.style.left = x*60 +'px';
                div.className = 'grid';
                div.style.borderRight   = '1px solid #333333';
                div.style.borderTop     = '1px solid #333333';
                div.style.borderLeft    = '1px solid #333333';
                div.style.borderBottom  = '1px solid #333333';
                div.setAttribute('data-num' , self.i);
                self.i++;
                self.main.appendChild(div);
            }
        }
    }

    self.assimilate = function(newNum,oldNum){
        let div = self.main.getElementsByClassName('grid');
        for(let i = 0;i< self.w*self.h;i++){
            if(div[i].getAttribute('data-num') === oldNum){
                div[i].setAttribute('data-num' , newNum);
            }    
        }
    }

    self.sort =function(){
        let num = self.getRandom(0, self.w * self.h -1);
        let direction = ['top','right','bottom','left'];
        let div = self.main.getElementsByClassName('grid');
        if(num%10 ===0){direction.splice(3, 1)};
        if(parseInt(num/10) === self.h-1){direction.splice(2, 1)};
        if(num%10 ===9){direction.splice(1, 1)};
        if(parseInt(num/10) === 0){direction.splice(0, 1)};
        let chkDirection = direction[self.getRandom(0,direction.length)]; 
        let oldNum;
        switch(chkDirection){
            case 'top':
                oldNum = num-10;
                if(div[num].getAttribute('data-num') === div[oldNum].getAttribute('data-num')){
                    return self.sort();
                }
                    div[num].style.borderTop = 'none';
                    div[oldNum].style.borderBottom = 'none';
                    self.assimilate(div[num].getAttribute('data-num') , div[oldNum].getAttribute('data-num'));
                break;
            case 'right':
                oldNum = num +1;
                if(div[num].getAttribute('data-num') === div[oldNum].getAttribute('data-num')){
                    return self.sort();
                }
                    div[num].style.borderRight  = 'none';
                    div[oldNum].style.borderLeft  = 'none';
                    self.assimilate(div[num].getAttribute('data-num') , div[oldNum].getAttribute('data-num'));
                break
            case 'bottom':
                oldNum = num+10;
                if(div[num].getAttribute('data-num') === div[oldNum].getAttribute('data-num')){
                    return self.sort();
                }
                    div[num].style.borderBottom = 'none';
                    div[oldNum].style.borderTop  = 'none';
                    self.assimilate(div[num].getAttribute('data-num') , div[oldNum].getAttribute('data-num'));
                break;
            case 'left':
                oldNum = num -1;
                if(div[num].getAttribute('data-num') === div[oldNum].getAttribute('data-num')){
                    return self.sort();
                }
                    div[num].style.borderLeft  = 'none';
                    div[oldNum].style.borderRight  = 'none';
                    self.assimilate(div[num].getAttribute('data-num') , div[oldNum].getAttribute('data-num'));
                break;
            default:
                break;
        }
        return self.check();
    }

    self.check = function(){
        let num;
        let div = self.main.getElementsByClassName('grid');
        num = div[0].getAttribute('data-num');
        for(let i=0;i < div.length;i++){
            if( num !== div[i].getAttribute('data-num')){
                    self.sort();
                return false;
            }
        }
        return initPlayer();
    }
    let move = function(_direction){
        let div;
        switch (_direction) {
            case 'up':
                div = document.getElementsByClassName('grid')[self.playerPos];
                if(div.style.borderTop === 'none'){
                    self.playerPos -=10;
                }
                break;
            case 'left':
                div = document.getElementsByClassName('grid')[self.playerPos];
                if(div.style.borderLeft === 'none'){
                    self.playerPos -=1;
                }
                break;
            case 'right':
                div = document.getElementsByClassName('grid')[self.playerPos];
                if(div.style.borderRight === 'none'){
                    self.playerPos +=1;
                }
                break;
            case 'down':
                div = document.getElementsByClassName('grid')[self.playerPos];
                if(div.style.borderBottom === 'none'){
                    self.playerPos +=10;
                }
                break;
            default:
                break;
        }
        self.player.style.top = parseInt(self.playerPos/10) * 60 +'px';
        self.player.style.left = (self.playerPos%10) * 60 +'px';

    }

    document.addEventListener('keydown', function (e) {
        var key = e.which || e.keyCode;
        let div;
        switch (key) {
            case 87://w
            case 38://up
                div = document.getElementsByClassName('grid')[self.playerPos];
                if(div.style.borderTop === 'none'){
                    self.playerPos -=10;
                }
                break;
            case 65://a
            case 37://left
                if(self.direction === 0 ){
                    self.direction =3;
                }else{
                    self.direction--;
                }

                div = document.getElementsByClassName('grid')[self.playerPos];
                if(div.style.borderLeft === 'none'){
                    self.playerPos -=1;
                }
                break;
            case 68://d
            case 39://right

                if(self.direction === 3 ){
                    self.direction = 0;
                }else{
                    self.direction++;
                }

                div = document.getElementsByClassName('grid')[self.playerPos];
                if(div.style.borderRight === 'none'){
                    self.playerPos +=1;
                }
                break;
            case 83://s
            case 40://down
                div = document.getElementsByClassName('grid')[self.playerPos];
                if(div.style.borderBottom === 'none'){
                    self.playerPos +=10;
                }
                break;
            default:
                break;
        }
        self.player.style.top = parseInt(self.playerPos/10) * 60 +'px';
        self.player.style.left = (self.playerPos%10) * 60 +'px';
    });

    let initPlayer = function(){
        self.playerPos = self.getRandom(90,99);
        self.player.className = 'player';
        self.player.style.top = parseInt(self.playerPos/10) * 60 +'px';
        self.player.style.left = (self.playerPos%10) * 60 +'px';
        self.main.appendChild(self.player);
        init(self.playerPos);
    }

}
let kruskal = new Kruskal();
kruskal.init();
kruskal.sort();

