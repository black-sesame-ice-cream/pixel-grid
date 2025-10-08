document.addEventListener('DOMContentLoaded', () => {
    // --- 要素の取得 ---
    const canvas = document.getElementById('gridCanvas');
    const ctx = canvas.getContext('2d');
    const sizeSlider = document.getElementById('gridSize');
    const sizeLabel = document.getElementById('gridSizeLabel');
    const sizeLabel2 = document.getElementById('gridSizeLabel2');
    const saveButton = document.getElementById('saveButton');
    const clearButton = document.getElementById('clearButton');
    const incrementBtn = document.getElementById('incrementBtn');
    const decrementBtn = document.getElementById('decrementBtn');
    
    // クリア確認モーダル
    const confirmClearModal = document.getElementById('confirmClearModal');
    const confirmClearBtn = document.getElementById('confirmClearBtn');
    const cancelClearBtn = document.getElementById('cancelClearBtn');

    // サイズ変更確認モーダル
    const confirmResizeModal = document.getElementById('confirmResizeModal');
    const confirmResizeBtn = document.getElementById('confirmResizeBtn');
    const cancelResizeBtn = document.getElementById('cancelResizeBtn');

    // --- グローバル変数 ---
    let n = parseInt(sizeSlider.value, 10);
    let gridState;
    let isDrawing = false;
    let paintMode = 0; // 0: 消去(白), 1: 描画(黒)
    let pendingNewSize = n; // サイズ変更を一時的に保持する変数

    // --- 関数定義 ---
    
    /**
     * グリッドが空か（全て白いか）をチェックします。
     * @returns {boolean} グリッドが空ならtrue、そうでなければfalse。
     */
    function isGridEmpty() {
        // gridStateの全ての要素が0ならtrueを返す
        return gridState.every(row => row.every(cell => cell === 0));
    }

    /**
     * グリッドのサイズを更新し、再描画します。
     * @param {number} newSize - 新しいグリッドのサイズ。
     */
    function updateGridSize(newSize) {
        const size = Math.max(1, Math.min(64, newSize)); // 1〜64の範囲に収める
        n = size;
        pendingNewSize = size; // pendingも更新
        sizeSlider.value = size;
        sizeLabel.textContent = size;
        sizeLabel2.textContent = size;
        initializeGrid();
    }
    
    /**
     * グリッドの状態を初期化（全て白にリセット）し、再描画します。
     */
    function initializeGrid() {
        gridState = Array.from({ length: n }, () => Array(n).fill(0));
        drawGrid();
    }

    /**
     * 現在のgridStateに基づいてキャンバス全体を描画します。
     */
    function drawGrid() {
        const cellSize = canvas.width / n;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // セルの色を塗る
        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                ctx.fillStyle = gridState[row][col] === 1 ? 'black' : 'white';
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }

        // ガイドラインを描画
        ctx.strokeStyle = '#e0d9c4';
        ctx.lineWidth = 1;
        for (let i = 1; i < n; i++) {
            ctx.beginPath();
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(canvas.width, i * cellSize);
            ctx.stroke();
        }
    }

    /**
     * イベント座標下のセルを描画/消去します。
     * @param {MouseEvent} event - マウスイベント。
     */
    function paintCell(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const cellSize = canvas.width / n;
        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);

        if (row < 0 || row >= n || col < 0 || col >= n) return;
        
        // 既に同じ色なら再描画しない（パフォーマンス向上）
        if (gridState[row][col] !== paintMode) {
            gridState[row][col] = paintMode;
            drawGrid();
        }
    }

    /**
     * サイズ変更のリクエストを処理します。グリッドが空でなければ確認モーダルを表示します。
     * @param {number} newSize - 希望する新しいサイズ。
     */
    function handleSizeChangeRequest(newSize) {
        if (newSize === n) return; // サイズが変わらない場合は何もしない

        if (isGridEmpty()) {
            updateGridSize(newSize);
        } else {
            pendingNewSize = newSize;
            confirmResizeModal.style.display = 'flex';
        }
    }
    
    // --- イベントリスナー ---

    // 描画関連
    canvas.addEventListener('mousedown', (event) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const cellSize = canvas.width / n;
        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);

        // 押したマスの色が白なら描画モード、黒なら消去モードに設定
        paintMode = 1 - gridState[row][col];
        
        paintCell(event); // クリックしただけでも描画
    });

    canvas.addEventListener('mousemove', (event) => {
        if (isDrawing) {
            paintCell(event);
        }
    });
    canvas.addEventListener('mouseup', () => { isDrawing = false; });
    canvas.addEventListener('mouseleave', () => { isDrawing = false; });

    // サイズ変更関連
    sizeSlider.addEventListener('input', () => {
        handleSizeChangeRequest(parseInt(sizeSlider.value, 10));
    });
    // スライダーからマウスを離した時に、キャンセルされていたらスライダー表示を元に戻す
    sizeSlider.addEventListener('change', () => {
        if (sizeSlider.value != n) {
            sizeSlider.value = n;
        }
    });
    incrementBtn.addEventListener('click', () => { handleSizeChangeRequest(n + 1); });
    decrementBtn.addEventListener('click', () => { handleSizeChangeRequest(n - 1); });

    // サイズ変更確認モーダル
    confirmResizeBtn.addEventListener('click', () => {
        updateGridSize(pendingNewSize);
        confirmResizeModal.style.display = 'none';
    });
    cancelResizeBtn.addEventListener('click', () => {
        sizeSlider.value = n; // スライダーの表示を元に戻す
        confirmResizeModal.style.display = 'none';
    });

    // クリアボタンとクリア確認モーダル
    clearButton.addEventListener('click', () => {
        confirmClearModal.style.display = 'flex';
    });
    confirmClearBtn.addEventListener('click', () => {
        initializeGrid();
        confirmClearModal.style.display = 'none';
    });
    cancelClearBtn.addEventListener('click', () => {
        confirmClearModal.style.display = 'none';
    });
    confirmClearModal.addEventListener('click', (event) => {
        if (event.target === confirmClearModal) {
            confirmClearModal.style.display = 'none';
        }
    });

    // 保存ボタン
    saveButton.addEventListener('click', () => {
        const outputSize = 1080;
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = outputSize;
        offscreenCanvas.height = outputSize;
        const offscreenCtx = offscreenCanvas.getContext('2d');
        const cellSize = outputSize / n;

        offscreenCtx.clearRect(0, 0, outputSize, outputSize);

        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                if (gridState[row][col] === 1) {
                    offscreenCtx.fillStyle = 'black';
                    offscreenCtx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                }
            }
        }

        const link = document.createElement('a');
        link.download = `grid_${n}x${n}.png`;
        link.href = offscreenCanvas.toDataURL('image/png');
        link.click();
    });
    
    // --- 初期化 ---
    initializeGrid();
});