import React, { useRef, useState, useEffect } from "react";

type CanvasDrawingProps = {
  userEmail: string;
  userName: string;
  userColor: string;
  onFinish: (imageDataUrl: string) => void;
};

const CanvasDrawing: React.FC<CanvasDrawingProps> = ({
  userEmail: _userEmail,
  userName: _userName,
  userColor,
  onFinish,
}) => {
  const baseCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState(userColor);
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<"brush" | "eraser">("brush");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  // 初始化 canvas
  useEffect(() => {
    const baseCanvas = baseCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;
    if (!baseCanvas || !drawCanvas) return;

    const baseCtx = baseCanvas.getContext("2d");
    const drawCtx = drawCanvas.getContext("2d");
    if (!baseCtx || !drawCtx) return;

    // 設置 canvas 尺寸 - 調寬一些讓襪子更胖
    baseCanvas.width = 700;
    baseCanvas.height = 700;
    drawCanvas.width = 700;
    drawCanvas.height = 700;

    // 載入聖誕襪模板到底層 canvas
    const sockImg = new Image();
    sockImg.src = "/sock.png";
    sockImg.onload = () => {
      baseCtx.drawImage(sockImg, 0, 0, baseCanvas.width, baseCanvas.height);
    };
  }, []);

  // 開始繪製
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  // 繪製
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing && e.type !== "mousedown" && e.type !== "touchstart") return;

    const canvas = drawCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = currentColor;
    }

    if (e.type === "mousedown" || e.type === "touchstart") {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  // 停止繪製
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // 清空畫布（重作）
  const clearCanvas = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // 完成繪製 - 合併兩層 canvas
  const handleFinish = () => {
    const baseCanvas = baseCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;
    if (!baseCanvas || !drawCanvas) return;

    // 創建臨時 canvas 來合併
    const mergedCanvas = document.createElement('canvas');
    mergedCanvas.width = baseCanvas.width;
    mergedCanvas.height = baseCanvas.height;
    const mergedCtx = mergedCanvas.getContext('2d');
    if (!mergedCtx) return;

    // 先畫底層（襪子模板）
    mergedCtx.drawImage(baseCanvas, 0, 0);
    // 再畫繪製層
    mergedCtx.drawImage(drawCanvas, 0, 0);

    const imageDataUrl = mergedCanvas.toDataURL("image/png");
    onFinish(imageDataUrl);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: isMobile
          ? "url('/canva-mobile.png')"
          : "url('/canva.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* 畫布區域 - 雙層結構 */}
      <div style={{ position: "relative" }}>
        {/* 底層：襪子模板 */}
        <canvas
          ref={baseCanvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            border: "3px solid #fff",
            borderRadius: "15px",
            maxWidth: "90vw",
            maxHeight: "60vh",
            pointerEvents: "none",
          }}
        />
        {/* 繪製層 */}
        <canvas
          ref={drawCanvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{
            position: "relative",
            border: "3px solid #fff",
            borderRadius: "15px",
            cursor: tool === "brush" ? "crosshair" : "pointer",
            maxWidth: "90vw",
            maxHeight: "60vh",
            touchAction: "none",
          }}
        />
      </div>

      {/* 工具列 */}
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          display: "flex",
          gap: "15px",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: "15px 25px",
          borderRadius: "50px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* 筆刷大小 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
          <label style={{ fontSize: "12px", color: "#666" }}>筆刷</label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            style={{ width: "80px" }}
          />
          <span style={{ fontSize: "12px", color: "#333" }}>{brushSize}px</span>
        </div>

        {/* 分隔線 */}
        <div style={{ width: "1px", height: "50px", backgroundColor: "#ddd" }} />

        {/* 筆刷工具 */}
        <button
          onClick={() => setTool("brush")}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: tool === "brush" ? "3px solid #4CAF50" : "2px solid #ddd",
            backgroundColor: tool === "brush" ? "#e8f5e9" : "#fff",
            cursor: "pointer",
            fontSize: "24px",
          }}
        >
          🖌️
        </button>

        {/* 橡皮擦 */}
        <button
          onClick={() => setTool("eraser")}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: tool === "eraser" ? "3px solid #4CAF50" : "2px solid #ddd",
            backgroundColor: tool === "eraser" ? "#e8f5e9" : "#fff",
            cursor: "pointer",
            fontSize: "24px",
          }}
        >
          🧹
        </button>

        {/* 分隔線 */}
        <div style={{ width: "1px", height: "50px", backgroundColor: "#ddd" }} />

        {/* 顏色選擇器 */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              border: "3px solid #fff",
              backgroundColor: currentColor,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            }}
          />
          {showColorPicker && (
            <div
              style={{
                position: "absolute",
                bottom: "60px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#fff",
                padding: "10px",
                borderRadius: "10px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              }}
            >
              <input
                type="color"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                style={{
                  width: "150px",
                  height: "150px",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              />
            </div>
          )}
        </div>

        {/* 重作 */}
        <button
          onClick={clearCanvas}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: "2px solid #ddd",
            backgroundColor: "#fff",
            cursor: "pointer",
            fontSize: "24px",
          }}
        >
          🔄
        </button>

        {/* 分隔線 */}
        <div style={{ width: "1px", height: "50px", backgroundColor: "#ddd" }} />

        {/* Finish 按鈕 */}
        <button
          onClick={handleFinish}
          style={{
            width: "120px",
            height: "50px",
            backgroundImage: "url('/finishButton.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
};

export default CanvasDrawing;