document.addEventListener('DOMContentLoaded', () => {
    // --- 要素の取得 ---
    const gridCanvas = document.getElementById('gridCanvas');
    const topRuler = document.getElementById('topRuler');
    const leftRuler = document.getElementById('leftRuler');
    const ctx = gridCanvas.getContext('2d');
    const ctxTop = topRuler.getContext('2d');
    const ctxLeft = leftRuler.getContext('2d');

    const sizeSlider = document.getElementById('gridSize');
    const sizeLabel = document.getElementById('gridSizeLabel');
    const sizeLabel2 = document.getElementById('gridSizeLabel2');
    const incrementBtn = document.getElementById('incrementBtn');
    const decrementBtn = document.getElementById('decrementBtn');
    
    const subGridSizeSlider = document.getElementById('subGridSize');
    const subGridSizeLabel = document.getElementById('subGridSizeLabel');
    const subIncrementBtn = document.getElementById('subIncrementBtn');
    const subDecrementBtn = document.getElementById('subDecrementBtn');

    const saveButton = document.getElementById('saveButton');
    const clearButton = document.getElementById('clearButton');
    
    // モーダル関連
    const confirmClearModal = document.getElementById('confirmClearModal');
    const confirmClearBtn = document.getElementById('confirmClearBtn');
    const cancelClearBtn = document.getElementById('cancelClearBtn');
    const saveErrorModal = document.getElementById('saveErrorModal');
    const closeErrorBtn = document.getElementById('closeErrorBtn');

    // --- グローバル変数 ---
    const canvasSize = 640;
    const rulerSize = 30;
    let n = parseInt(sizeSlider.value, 10);
    let m = parseInt(subGridSizeSlider.value, 10);
    let gridState;
    let isDrawing = false;
    let paintMode = 0; // 0: 消去(白), 1: 描画(黒)

    // --- 関数定義 ---
    
    /** グリッドサイズを更新し、描画内容を維持する */
    function updateGridSize(newSize) {
        const oldSize = n;
        const oldGridState = gridState; // 古い描画状態を保持

        const size = Math.max(1, Math.min(64, newSize));
        n = size;
        sizeSlider.value = size;
        sizeLabel.textContent = size;
        sizeLabel2.textContent = size;
        
        // 新しいサイズのグリッドを作成し、0で初期化
        const newGridState = Array.from({ length: n }, () => Array(n).fill(0));
        
        // 古い描画状態を新しいグリッドにコピー
        const copyLimit = Math.min(oldSize, n);
        for (let row = 0; row < copyLimit; row++) {
            for (let col = 0; col < copyLimit; col++) {
                newGridState[row][col] = oldGridState[row][col];
            }
        }
        
        gridState = newGridState;
        drawGrid();
    }
    
    /** グリッドを初期化（クリア） */
    function initializeGrid() {
        gridState = Array.from({ length: n }, () => Array(n).fill(0));
        // キャンバスの物理的なサイズを設定
        gridCanvas.width = canvasSize;
        gridCanvas.height = canvasSize;
        topRuler.width = canvasSize;
        topRuler.height = rulerSize;
        leftRuler.width = rulerSize;
        leftRuler.height = canvasSize;
        drawGrid();
    }

    /** キャンバス全体を描画 */
    function drawGrid() {
        drawCells();
        drawRulersAndLines();
    }
    
    /** セル（黒/白）を描画 */
    function drawCells() {
        const cellSize = gridCanvas.width / n;
        ctx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                ctx.fillStyle = gridState[row][col] === 1 ? 'black' : 'white';
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
    }
    
    /** 目盛とグリッド線を描画 */
    function drawRulersAndLines() {
        const cellSize = gridCanvas.width / n;
        
        ctxTop.clearRect(0, 0, topRuler.width, topRuler.height);
        ctxLeft.clearRect(0, 0, leftRuler.width, leftRuler.height);
        drawCells();

        ctxTop.textAlign = "center";
        ctxTop.textBaseline = "middle";
        ctxTop.fillStyle = "#5a4b41";
        ctxTop.font = "12px sans-serif";
        ctxLeft.textAlign = "center";
        ctxLeft.textBaseline = "middle";
        ctxLeft.fillStyle = "#5a4b41";
        ctxLeft.font = "12px sans-serif";

        ctx.beginPath();
        ctx.strokeStyle = '#e0d9c4';
        ctx.lineWidth = 1;
        for (let i = 1; i < n; i++) {
            if (i % m !== 0) {
                const pos = i * cellSize;
                ctx.moveTo(pos, 0);
                ctx.lineTo(pos, gridCanvas.height);
                ctx.moveTo(0, pos);
                ctx.lineTo(gridCanvas.width, pos);
            }
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = '#b3a394';
        ctx.lineWidth = 2;
        for (let i = 1; i < n; i++) {
            if (i % m === 0) {
                const pos = i * cellSize;
                ctx.moveTo(pos, 0);
                ctx.lineTo(pos, gridCanvas.height);
                ctx.moveTo(0, pos);
                ctx.lineTo(gridCanvas.width, pos);
                ctxTop.fillText(i, pos, rulerSize / 2);
                ctxLeft.fillText(i, rulerSize / 2, pos);
            }
        }
        ctx.stroke();
    }

    /** マス目を塗る処理 */
    function paintCell(event) {
        const rect = gridCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const cellSize = gridCanvas.width / n;
        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);

        if (row < 0 || row >= n || col < 0 || col >= n) return;
        
        if (gridState[row][col] !== paintMode) {
            gridState[row][col] = paintMode;
            drawGrid();
        }
    }
    
    // --- イベントリスナー ---

    // 描画関連
    gridCanvas.addEventListener('mousedown', (event) => {
        isDrawing = true;
        const rect = gridCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const cellSize = gridCanvas.width / n;
        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);
        paintMode = 1 - gridState[row][col];
        paintCell(event);
    });
    gridCanvas.addEventListener('mousemove', (event) => { if (isDrawing) paintCell(event); });
    document.addEventListener('mouseup', () => { isDrawing = false; });
    gridCanvas.addEventListener('mouseleave', () => { isDrawing = false; });

    // グリッドサイズ変更
    sizeSlider.addEventListener('input', () => updateGridSize(parseInt(sizeSlider.value, 10)));
    incrementBtn.addEventListener('click', () => updateGridSize(n + 1));
    decrementBtn.addEventListener('click', () => updateGridSize(n - 1));

    // 補助目盛サイズ変更
    subGridSizeSlider.addEventListener('input', () => {
        m = parseInt(subGridSizeSlider.value, 10);
        subGridSizeLabel.textContent = m;
        drawGrid();
    });
    subIncrementBtn.addEventListener('click', () => {
        if (m < 32) {
            m++;
            subGridSizeSlider.value = m;
            subGridSizeLabel.textContent = m;
            drawGrid();
        }
    });
    subDecrementBtn.addEventListener('click', () => {
        if (m > 2) {
            m--;
            subGridSizeSlider.value = m;
            subGridSizeLabel.textContent = m;
            drawGrid();
        }
    });

    // クリア確認モーダル
    clearButton.addEventListener('click', () => confirmClearModal.style.display = 'flex');
    confirmClearBtn.addEventListener('click', () => {
        initializeGrid();
        confirmClearModal.style.display = 'none'; // 修正：正しいモーダルを閉じる
    });
    cancelClearBtn.addEventListener('click', () => confirmClearModal.style.display = 'none');
    
    // PNG保存
    saveButton.addEventListener('click', () => {
        const outputSize = 1080;
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = outputSize;
        offscreenCanvas.height = outputSize;
        const offscreenCtx = offscreenCanvas.getContext('2d');
        const cellSize = outputSize / n;

        offscreenCtx.fillStyle = 'black';
        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                if (gridState[row][col] === 1) {
                    offscreenCtx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                }
            }
        }
        
        try {
            const imageData = offscreenCtx.getImageData(0, 0, outputSize, outputSize);
            const buffer = imageData.data.buffer;
            const pngBuffer = UPNG.encode([buffer], outputSize, outputSize, 0);
            const blob = new Blob([pngBuffer], { type: 'image/png' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `pixel_grid_${n}x${n}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("PNGの圧縮に失敗しました:", error);
            saveErrorModal.style.display = 'flex';
        }
    });
    
    // エラーモーダル閉じる
    closeErrorBtn.addEventListener('click', () => saveErrorModal.style.display = 'none');

    // --- 初期化 ---
    initializeGrid();
});

