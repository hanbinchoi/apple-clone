(() => {

    
    let yOffset = 0; // window.scrollY 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤 위치 (yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬 (scroll-section) (0~3)
    let enterNewScene = false; // 새로운 scene이 시작되는 순간 true

    //  각 구간에 대한 정보를 담는 배열
    const sceneInfo = [
        {
            // scroll-section-0
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 셋팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d')
            },
            values: {
                // message가 나타나는 애니메이션 정보
                messageA_opacity_in: [0, 1, {start: 0.1, end: 0.2}], // opacity 시작(0)과 끝(1), 메세지가 출력될 현재 scene의 비율에 시작과 끝 (10%~20%) 
                messageB_opacity_in: [0, 1, {start: 0.3, end: 0.4}],
                messageC_opacity_in: [0, 1, {start: 0.5, end: 0.6}],
                messageD_opacity_in: [0, 1, {start: 0.7, end: 0.8}],
                
                messageA_translateY_in: [20, 0, {start: 0.1, end: 0.2}], // 아래로 내려오는 애니메이션 정보 [시작할때 20%, 끝날때 0%]
                messageB_translateY_in: [20, 0, {start: 0.3, end: 0.4}],
                messageC_translateY_in: [20, 0, {start: 0.5, end: 0.6}],
                messageD_translateY_in: [20, 0, {start: 0.7, end: 0.8}],

                // message가 사라지는 애니메이션 정보
                messageA_opacity_out: [1,0, {start:0.25, end:0.3}],
                messageB_opacity_out: [1,0, {start:0.45, end:0.5}],
                messageC_opacity_out: [1,0, {start:0.65, end:0.7}],
                messageD_opacity_out: [1,0, {start:0.85, end:0.9}],
            
                messageA_translateY_out: [0,-20, {start:0.25, end:0.3}],
                messageB_translateY_out: [0,-20, {start:0.45, end:0.5}],
                messageC_translateY_out: [0,-20, {start:0.65, end:0.7}],
                messageD_translateY_out: [0,-20, {start:0.85, end:0.9}],
            }
        },
        {
            // scroll-section-1
            type: 'normal',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        },
        {
            // scroll-section-2
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2'),
                
                messageA: document.querySelector('#scroll-section-2 .main-message.a'),
                messageB: document.querySelector('#scroll-section-2 .desc-message.b'),
                messageC: document.querySelector('#scroll-section-2 .desc-message.c'),

                pinB: document.querySelector("#scroll-section-2 .desc-message.b .pin"),
                pinC: document.querySelector("#scroll-section-2 .desc-message.c .pin"),
                
            },
            values: {
                // message가 나타나는 애니메이션 정보
                messageA_opacity_in: [0, 1, {start: 0.15, end: 0.2}], 
                messageB_opacity_in: [0, 1, {start: 0.5, end: 0.55}],
                messageC_opacity_in: [0, 1, {start: 0.72, end: 0.77}],
                
                messageA_translateY_in: [20, 0, {start: 0.15, end: 0.2}], 
                messageB_translateY_in: [30, 0, {start: 0.5, end: 0.55}],
                messageC_translateY_in: [30, 0, {start: 0.72, end: 0.77}],
                
                pinB_scaleY: [0.5, 1, {start: 0.5, end: 0.55}],
                pinC_scaleY: [0.5, 1, {start: 0.72, end: 0.77}],
                
                pinB_opacity_in: [0, 1, {start: 0.5, end: 0.55}],
                pinC_opacity_in: [0, 1, {start: 0.72, end: 0.77}],

                // message가 사라지는 애니메이션 정보
                messageA_opacity_out: [1,0, {start:0.3, end:0.4}],
                messageB_opacity_out: [1,0, {start:0.58, end:0.68}],
                messageC_opacity_out: [1,0, {start:0.85, end: 0.95}],

                messageA_translateY_out: [0,-20, {start:0.3, end:0.35}],
                messageB_translateY_out: [0,-20, {start:0.58, end:0.68}],
                messageC_translateY_out: [0,-20, {start:0.85, end: 0.95}],
                
                pinB_opacity_out: [1,0, {start:0.58, end:0.68}],
                pinC_opacity_out: [1,0, {start:0.85, end: 0.95}],
            }
        },
        {
            // scroll-section-3
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3'),
                canvasCaption: document.querySelector('.cavas-caption')
            },
            
        }
    ];

    function setLayout() {
        // 각 스크롤 섹션의 높이 셋팅
        for (let i = 0; i < sceneInfo.length; i++) {
            if(sceneInfo[i].type === 'sticky'){
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if(sceneInfo[i].type === 'normal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`
        }
        yOffset = window.scrollY;
        let totalScrollHeight = 0;
        for (let i = 0; i<sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight; // 각 scene의 스크롤 높이를 다 더해준다.
            if (totalScrollHeight >= yOffset) { // 현재 스크롤 위치를 비교해서 현재 스크롤 위치보다 더한 값이 더 커지면 
                currentScene = i; // 현재 i를 current scene에 셋팅하고 나온다.
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    function calcValues(values, currentYOffset) { // 스크롤에 따라 값 계산
        let rv; // 리턴 값
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight; // 현재 씬에서 얼만큼 스크롤 되었는지에 대한 비율
        
        if (values.length === 3) {
            // start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd){ // scroll 이 설정한 start와 end 사이에 있으면
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0]; 
            } else if (currentYOffset < partScrollStart) { // start지점보다 작으면 초기값
                rv = values[0];
            } else if (currentYOffset > partScrollEnd) { // end 지점보다 크면 초기값
                rv = values[1];
            }
        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0]; // 리턴 값 = 스크롤 비율 * scene의 높이
        }
        return rv;
    }

    function playAnimation() { // 현재 section 별 animation
        const values = sceneInfo[currentScene].values;
        const objs = sceneInfo[currentScene].objs;
        const currentYOffset = yOffset - prevScrollHeight; // 현재 씬에서 스크롤 위치 
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight; // 전체 문서의 scrollHeight / 현재 scene의 scrollHeight
        switch (currentScene) {
            case 0:
                // section 0 messages
                if (scrollRatio <= 0.22){
                    // in
                    //  translate3d 가 translateY보다 더 성능이 좋아서 권장.
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }
                
                if (scrollRatio <= 0.42){
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.62){
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                }
                
                if (scrollRatio <= 0.82){
                    // in
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
                }
                
                break;
                
            case 1: // normal type이므로 컨트롤할 대상이 없다
                break;

            case 2:
                // section 2 messages
                if (scrollRatio <= 0.32){
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }
                
                if (scrollRatio <= 0.67){
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                    
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                }

                if (scrollRatio <= 0.93){
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                }
                break;
            case 3:
                break;
            
        }
    }

    function scrollLoop() {
        enterNewScene = false;
        prevScrollHeight = 0;
        for (let i =0; i<currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        // 현재 스크롤 위치가 이전 scene의 높이를 더한것들 보다 크면 scene의 위치를 +
        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true; // scene이 바뀌는 순간 true
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        // 현재 스크롤 위치가 이전 scene의 높이보다 작아지면 scene의 위치를 -
        if (yOffset < prevScrollHeight) {
            enterNewScene = true;
            if(currentScene === 0 ) return; // 만약 현재 scene이 -로 바뀔 수 있으니까 그것을 막기 위한 예방장치
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        
        if (enterNewScene) {
            return 0; // scene이 바뀌는 순간은 함수를 종료 시켜서 오류 방지
        }

        playAnimation(); // scene이 안바뀌면 계속해서 animation 재생
    }

    window.addEventListener('scroll', () => {
        yOffset = window.scrollY;
        scrollLoop();
    });
    window.addEventListener('load', setLayout);
    window.addEventListener('resize', setLayout);
})();