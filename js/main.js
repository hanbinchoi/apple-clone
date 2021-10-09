(() => {
    let yOffset = 0; // window.scrollY 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤 위치 (yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬 (scroll-section) (0~3)
    let enterNewScene = false; // 새로운 scene이 시작되는 순간 true

    // animation 변수
    let acc = 0.1;
    let delayedYOffset = 0;
    let rafId;
    let rafState;

    //  각 구간에 대한 정보를 담는 배열
    const sceneInfo = [{
            // scroll-section-0
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 셋팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
                canvas: document.querySelector('#video-canvas-0'),
                context: document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages: []
            },
            values: {

                // video의 image 정보
                videoImageCount: 300, // 이미지 개수
                imageSequence: [0, 299], // 이미지 시작 과 끝
                canvas_opacity: [1, 0, {
                    start: 0.9,
                    end: 0.95
                }], // scene전환시 비디오가 자연스럽게 투명화 되기 위한 정보. 

                // message가 나타나는 애니메이션 정보
                messageA_opacity_in: [0, 1, {
                    start: 0.1,
                    end: 0.2
                }], // opacity 시작(0)과 끝(1), 메세지가 출력될 현재 scene의 비율에 시작과 끝 (10%~20%) 
                messageB_opacity_in: [0, 1, {
                    start: 0.3,
                    end: 0.4
                }],
                messageC_opacity_in: [0, 1, {
                    start: 0.5,
                    end: 0.6
                }],
                messageD_opacity_in: [0, 1, {
                    start: 0.7,
                    end: 0.8
                }],

                messageA_translateY_in: [20, 0, {
                    start: 0.1,
                    end: 0.2
                }], // 아래로 내려오는 애니메이션 정보 [시작할때 20%, 끝날때 0%]
                messageB_translateY_in: [20, 0, {
                    start: 0.3,
                    end: 0.4
                }],
                messageC_translateY_in: [20, 0, {
                    start: 0.5,
                    end: 0.6
                }],
                messageD_translateY_in: [20, 0, {
                    start: 0.7,
                    end: 0.8
                }],

                // message가 사라지는 애니메이션 정보
                messageA_opacity_out: [1, 0, {
                    start: 0.25,
                    end: 0.3
                }],
                messageB_opacity_out: [1, 0, {
                    start: 0.45,
                    end: 0.5
                }],
                messageC_opacity_out: [1, 0, {
                    start: 0.65,
                    end: 0.7
                }],
                messageD_opacity_out: [1, 0, {
                    start: 0.85,
                    end: 0.9
                }],

                messageA_translateY_out: [0, -20, {
                    start: 0.25,
                    end: 0.3
                }],
                messageB_translateY_out: [0, -20, {
                    start: 0.45,
                    end: 0.5
                }],
                messageC_translateY_out: [0, -20, {
                    start: 0.65,
                    end: 0.7
                }],
                messageD_translateY_out: [0, -20, {
                    start: 0.85,
                    end: 0.9
                }],
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

                canvas: document.querySelector('#video-canvas-2'),
                context: document.querySelector('#video-canvas-2').getContext('2d'),
                videoImages: [],

            },
            values: {

                // video의 image 정보
                videoImageCount: 960, // 이미지 개수
                imageSequence: [0, 959], // 이미지 시작 과 끝
                canvas_opacity_in: [0, 1, {
                    start: 0,
                    end: 0.1
                }], // scene전환시 비디오가 자연스럽게 투명화 되기 위한 정보. 
                canvas_opacity_out: [1, 0, {
                    start: 0.95,
                    end: 1
                }],

                // message가 나타나는 애니메이션 정보
                messageA_opacity_in: [0, 1, {
                    start: 0.15,
                    end: 0.2
                }],
                messageB_opacity_in: [0, 1, {
                    start: 0.5,
                    end: 0.55
                }],
                messageC_opacity_in: [0, 1, {
                    start: 0.72,
                    end: 0.77
                }],

                messageA_translateY_in: [20, 0, {
                    start: 0.15,
                    end: 0.2
                }],
                messageB_translateY_in: [30, 0, {
                    start: 0.5,
                    end: 0.55
                }],
                messageC_translateY_in: [30, 0, {
                    start: 0.72,
                    end: 0.77
                }],

                pinB_scaleY: [0.5, 1, {
                    start: 0.5,
                    end: 0.55
                }],
                pinC_scaleY: [0.5, 1, {
                    start: 0.72,
                    end: 0.77
                }],

                pinB_opacity_in: [0, 1, {
                    start: 0.5,
                    end: 0.55
                }],
                pinC_opacity_in: [0, 1, {
                    start: 0.72,
                    end: 0.77
                }],

                // message가 사라지는 애니메이션 정보
                messageA_opacity_out: [1, 0, {
                    start: 0.3,
                    end: 0.35
                }],
                messageB_opacity_out: [1, 0, {
                    start: 0.58,
                    end: 0.63
                }],
                messageC_opacity_out: [1, 0, {
                    start: 0.85,
                    end: 0.9
                }],

                messageA_translateY_out: [0, -20, {
                    start: 0.3,
                    end: 0.35
                }],
                messageB_translateY_out: [0, -20, {
                    start: 0.58,
                    end: 0.63
                }],
                messageC_translateY_out: [0, -20, {
                    start: 0.85,
                    end: 0.9
                }],

                pinB_opacity_out: [1, 0, {
                    start: 0.58,
                    end: 0.63
                }],
                pinC_opacity_out: [1, 0, {
                    start: 0.85,
                    end: 0.9
                }],
            }
        },
        {
            // scroll-section-3
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3'),
                canvasCaption: document.querySelector('.canvas-caption'),
                canvas: document.querySelector('.image-blend-canvas'),
                context: document.querySelector('.image-blend-canvas').getContext('2d'),
                imagesPath: [
                    './images/blend-image-1.jpg',
                    './images/blend-image-2.jpg',

                ],
                images: []
            },
            values: {
                rect1X: [0, 0, {
                    start: 0,
                    end: 0
                }],
                rect2X: [0, 0, {
                    start: 0,
                    end: 0
                }],
                blendHeight: [0, 0, {
                    start: 0,
                    end: 0
                }],
                canvas_scale: [0, 0, {
                    start: 0,
                    end: 0
                }],
                canvasCaption_opacity: [
                    0, 1, {
                        start: 0,
                        end: 0
                    }
                ],
                canvasCaption_translateY: [
                    20,
                    0,
                    {
                        start: 0,
                        end: 0
                    }
                ],

                rectStartY: 0,

            }

        }
    ];

    function setCanvasImages() {
        let imgElem;
        // scene-0 이미지 처리
        for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
            imgElem = new Image();
            imgElem.src = `./video/001/IMG_${6726+i}.JPG`;
            sceneInfo[0].objs.videoImages.push(imgElem);
        }
        // scene-2 이미지 처리
        for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
            imgElem = new Image();
            imgElem.src = `./video/002/IMG_${7027+i}.JPG`;
            sceneInfo[2].objs.videoImages.push(imgElem);

        }

        //  scene-3 이미지 처리
        let imgElem3;
        for (let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++) {
            imgElem3 = new Image();
            imgElem3.src = sceneInfo[3].objs.imagesPath[i];
            sceneInfo[3].objs.images.push(imgElem3);
        }
    }

    function checkMenu() {
        if (yOffset > 44) {
            // 현재 스크론된 위치가 global-nav를 넘으면
            document.body.classList.add('local-nav-sticky');
        } else {
            document.body.classList.remove('local-nav-sticky');
        }
    }

    function setLayout() {
        // 각 스크롤 섹션의 높이 셋팅
        for (let i = 0; i < sceneInfo.length; i++) {
            if (sceneInfo[i].type === 'sticky') {
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if (sceneInfo[i].type === 'normal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`
        }
        yOffset = window.scrollY;
        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight; // 각 scene의 스크롤 높이를 다 더해준다.
            if (totalScrollHeight >= yOffset) { // 현재 스크롤 위치를 비교해서 현재 스크롤 위치보다 더한 값이 더 커지면 
                currentScene = i; // 현재 i를 current scene에 셋팅하고 나온다.
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);

        const heightRatio = window.innerHeight / 1080; // 원래 캔버스 높이를 윈도우 창 사이즈 크기에 akwcna
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
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

            if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) { // scroll 이 설정한 start와 end 사이에 있으면
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
                // section 0 videos
                // let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                // objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

                // section 0 messages
                if (scrollRatio <= 0.22) {
                    // in
                    //  translate3d 가 translateY보다 더 성능이 좋아서 권장.
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.42) {
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.62) {
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.82) {
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

                // let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
                // objs.context.drawImage(objs.videoImages[sequence2], 0, 0);

                if (scrollRatio <= 0.5) {
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
                } else {
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
                }

                if (scrollRatio <= 0.25) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.57) {
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

                if (scrollRatio <= 0.83) {
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                }


                // scene-3 canvas 미리 그려주기 
                if (scrollRatio > 0.9) {
                    const objs = sceneInfo[3].objs;
                    const values = sceneInfo[3].values;

                    const widthRatio = window.innerWidth / objs.canvas.width;
                    const heightRatio = window.innerHeight / objs.canvas.height; // 브라우저 높이 / 원래 캔버스 높이
                    let canvasScaleRatio;

                    if (widthRatio <= heightRatio) {
                        // 캔버스 보다 브라우저 창이 홀쭉한 경우
                        canvasScaleRatio = heightRatio;
                    } else {
                        // 캔버스 보다 브라우저 창이 납작한 경우
                        canvasScaleRatio = widthRatio;
                    }
                    objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                    objs.context.fillStyle = 'white';
                    objs.context.drawImage(objs.images[0], 0, 0);


                    // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight -> 새로운 창 크기 기준
                    const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                    const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;


                    const whiteRectWidth = recalculatedInnerWidth * 0.15;
                    values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                    values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                    values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
                    values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

                    // 좌우 흰색 박스 그리기
                    // objs.context.fillRect(values.rect1X[0], 0 ,parseInt(whiteRectWidth), objs.canvas.height);
                    // objs.context.fillRect(values.rect2X[0], 0 ,parseInt(whiteRectWidth), objs.canvas.height);

                    objs.context.fillRect(
                        parseInt(values.rect1X[0]),
                        0,
                        parseInt(whiteRectWidth),
                        objs.canvas.height
                    );
                    objs.context.fillRect(
                        parseInt(values.rect2X[0]),
                        0,
                        parseInt(whiteRectWidth),
                        objs.canvas.height
                    );
                }

                break;

            case 3:
                let step = 0; // scene 상황을 저장하는 변수

                // 가로, 세로 모두 꽉 차게 하기위해 여기서 세팅 (계산 필요)
                const widthRatio = window.innerWidth / objs.canvas.width;
                const heightRatio = window.innerHeight / objs.canvas.height; // 브라우저 높이 / 원래 캔버스 높이
                let canvasScaleRatio;

                if (widthRatio <= heightRatio) {
                    // 캔버스 보다 브라우저 창이 홀쭉한 경우
                    canvasScaleRatio = heightRatio;
                } else {
                    // 캔버스 보다 브라우저 창이 납작한 경우
                    canvasScaleRatio = widthRatio;
                }
                objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                objs.context.fillStyle = 'white';
                objs.context.drawImage(objs.images[0], 0, 0);


                // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight -> 새로운 창 크기 기준
                const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

                if (!values.rectStartY) {
                    // values.rectStartY = objs.canvas.getBoundingClientRect().top;  // 스크롤이 빠르게 진행될 경우 정확한 위치를 계산 못함.
                    values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;
                    values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight;
                    values.rect2X[2].start = (window.innerHeight / 2) / scrollHeight;
                    values.rect1X[2].end = values.rectStartY / scrollHeight;
                    values.rect2X[2].end = values.rectStartY / scrollHeight;

                }

                const whiteRectWidth = recalculatedInnerWidth * 0.15;
                values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
                values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

                // 좌우 흰색 박스 그리기
                objs.context.fillRect(
                    parseInt(calcValues(values.rect1X, currentYOffset)),
                    0,
                    parseInt(whiteRectWidth),
                    objs.canvas.height
                );
                objs.context.fillRect(
                    parseInt(calcValues(values.rect2X, currentYOffset)),
                    0,
                    parseInt(whiteRectWidth),
                    objs.canvas.height
                );

                if (scrollRatio < values.rect1X[2].end) {
                    // 캔버스가 브라우저 상단에 닿지 않으면 
                    step = 1;
                    objs.canvas.classList.remove('sticky');
                } else {
                    // 상단에 닿으면 위로 올라오는 이미지 블렌드 처리
                    step = 2;

                    values.blendHeight[0] = 0;
                    values.blendHeight[1] = objs.canvas.height;
                    values.blendHeight[2].start = values.rect1X[2].end; // 첫번째 이미지가 끝나는 지점이 두번째 이미지의 시작점.
                    values.blendHeight[2].end = values.blendHeight[2].start + 0.2;
                    const blendHeight = calcValues(values.blendHeight, currentYOffset);

                    objs.context.drawImage(objs.images[1],
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight
                    );

                    objs.canvas.classList.add('sticky');
                    objs.canvas.style.top = `${-(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2}px`


                    if (scrollRatio > values.blendHeight[2].end) {
                        // 이미지 블렌드가 끝난 시점
                        values.canvas_scale[0] = canvasScaleRatio; // 축소 초기값 -> 
                        values.canvas_scale[1] = document.body.offsetWidth / (1.5 * objs.canvas.width);
                        values.canvas_scale[2].start = values.blendHeight[2].end;
                        values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2;

                        objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentYOffset)})`;
                        objs.canvas.style.marginTop = 0;
                    }

                    if (scrollRatio > values.canvas_scale[2].end &&
                        values.canvas_scale[2].end > 0) {
                        objs.canvas.classList.remove('sticky');
                        objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`;

                        values.canvasCaption_opacity[2].start = values.canvas_scale[2].end;
                        values.canvasCaption_opacity[2].end = values.canvasCaption_opacity[2].start + 0.1;

                        values.canvasCaption_translateY[2].start = values.canvasCaption_opacity[2].start;
                        values.canvasCaption_translateY[2].end = values.canvasCaption_opacity[2].end;

                        objs.canvasCaption.style.opacity = calcValues(values.canvasCaption_opacity, currentYOffset);
                        objs.canvasCaption.style.transform = `translate3d(0, ${calcValues(values.canvasCaption_translateY, currentYOffset)}%, 0)`;


                    }
                }

                break;
        }
    }

    function scrollLoop() {
        enterNewScene = false;
        prevScrollHeight = 0;
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        // 현재 스크롤 위치가 이전 scene의 높이를 더한것들 보다 크면 scene의 위치를 +
        if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true; // scene이 바뀌는 순간 true

            if (currentScene === sceneInfo.length-1) { // 마지막 씬에 숨겨진 텍스트 지우기
                document.body.classList.add('scroll-effect-end');
            }

            if (currentScene < sceneInfo.length-1) { // scene3 까지만 currentScene 적용
                currentScene++;
            }
            
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        // 현재 스크롤 위치가 이전 scene의 높이보다 작아지면 scene의 위치를 -
        if (delayedYOffset < prevScrollHeight) {
            enterNewScene = true;
            if (currentScene === 0) return; // 만약 현재 scene이 -로 바뀔 수 있으니까 그것을 막기 위한 예방장치
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (enterNewScene) {
            return 0; // scene이 바뀌는 순간은 함수를 종료 시켜서 오류 방지
        }

        playAnimation(); // scene이 안바뀌면 계속해서 animation 재생
    }

    // 부드러운 애니메이션 처리
    function loop() {
        delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

        if (!enterNewScene) {
            const currentYOffset = delayedYOffset - prevScrollHeight; // 현재 씬에서 스크롤 위치 
            const values = sceneInfo[currentScene].values;
            const objs = sceneInfo[currentScene].objs;

            if (currentScene === 0 || currentScene === 2) {
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));

                if (objs.videoImages[sequence]) {

                    objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                }
            }

        }


        rafId = requestAnimationFrame(loop);

        if (Math.abs(yOffset - delayedYOffset) < 1) {
            cancelAnimationFrame(rafId);
            rafState = false;
        }
    }


    window.addEventListener('load', () => {

        document.body.classList.remove('before-load');
        setLayout();
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0); // 처음 페이지가 로드되었을때 이미지가 나오게 하기 위함.

        // 새로고침 시 정확한 화면 출력하기 위해 조금 자동 스크롤
        let tempYOffset = yOffset; // 현재 높이
        let tempScrollCount = 0; // 스크롤 카운트 하기 위한 변수

        if (yOffset > 0) {

            let siId = setInterval(() => {
                window.scrollTo(0, tempYOffset);
                tempYOffset +=  5;
    
                if (tempScrollCount > 20) {
                    clearInterval(siId);
                }
                tempScrollCount++;
            }, 20);
    
        }

        window.addEventListener('scroll', () => {
            yOffset = window.pageYOffset;
            scrollLoop();
            checkMenu();

            if (!rafState) {
                rafId = requestAnimationFrame(loop);
                rafState = true;
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) {
                setLayout();
                sceneInfo[3].values.rectStartY = 0;
            }

        });

        window.addEventListener('orientationchange', () => {
            scrollTo(0,0);
            setTimeout(() => {
                window.location.reload();
            },500); // 모바일 기기 화면 바꿀때
        }); 

        // 로드가 끝나면 로딩화면 삭제
        document.querySelector('.loading').addEventListener('transitionend', (e) => {
            document.body.removeChild(e.currentTarget);
        })
    });

    setCanvasImages();
})();