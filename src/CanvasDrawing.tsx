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
  const clipPathRef = useRef<Path2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState(userColor);
  const [brushSize, setBrushSize] = useState(8);
  const [tool, setTool] = useState<"brush" | "eraser">("brush");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [lastPoint, setLastPoint] = useState<{x: number, y: number} | null>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  // 初始化 canvas 和 clip path
  useEffect(() => {
    const baseCanvas = baseCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;
    if (!baseCanvas || !drawCanvas) return;

    const baseCtx = baseCanvas.getContext("2d");
    const drawCtx = drawCanvas.getContext("2d");
    if (!baseCtx || !drawCtx) return;

    const width = 700;
    const height = 700;
    baseCanvas.width = width;
    baseCanvas.height = height;
    drawCanvas.width = width;
    drawCanvas.height = height;

    const sockImg = new Image();
    sockImg.crossOrigin = "anonymous";
    sockImg.src = "/sock.png";
    sockImg.onload = () => {
      // 繪製襪子到底層
      baseCtx.clearRect(0, 0, width, height);
      baseCtx.drawImage(sockImg, 0, 0, width, height);

      // 創建一次性的 clip path
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
      if (!tempCtx) return;

      // 將襪子繪製到臨時 canvas
      tempCtx.drawImage(sockImg, 0, 0, width, height);
      
      // 從圖片創建 Path2D
      const path = new Path2D();
      const imageData = tempCtx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      // 掃描每個像素，找出襪子的輪廓
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          if (data[idx + 3] > 20) { // alpha > 20
            path.rect(x, y, 1, 1);
          }
        }
      }
      
      clipPathRef.current = path;
      
      // 設置繪製層的 clip
      drawCtx.save();
      drawCtx.clip(path);
    };
  }, []);

  const getCoords = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = drawCanvasRef.current;
    if (!canvas) return;

    const coords = getCoords(e, canvas);
    if (!coords) return;

    setIsDrawing(true);
    setLastPoint(coords);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 確保 clip 已設置
    if (clipPathRef.current) {
      ctx.restore();
      ctx.save();
      ctx.clip(clipPathRef.current);
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = currentColor;
      ctx.fillStyle = currentColor;
    }

    // 畫起始點
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !lastPoint) return;
    e.preventDefault();

    const canvas = drawCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coords = getCoords(e, canvas);
    if (!coords) return;

    // 畫線
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    // 畫點（讓線條更平滑）
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();

    setLastPoint(coords);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clearCanvas = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 重新設置 clip
    if (clipPathRef.current) {
      ctx.restore();
      ctx.save();
      ctx.clip(clipPathRef.current);
    }
  };

  const handleFinish = () => {
    const baseCanvas = baseCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;
    if (!baseCanvas || !drawCanvas) return;

    const mergedCanvas = document.createElement('canvas');
    mergedCanvas.width = baseCanvas.width;
    mergedCanvas.height = baseCanvas.height;
    const mergedCtx = mergedCanvas.getContext('2d');
    if (!mergedCtx) return;

    mergedCtx.drawImage(baseCanvas, 0, 0);
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
        backgroundImage: isMobile ? "url('/canva-mobile.png')" : "url('/canva.png')",
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
      <div style={{ position: "relative", touchAction: "none", userSelect: "none" }}>
        <canvas
          ref={baseCanvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            border: "3px solid #fff",
            borderRadius: "15px",
            width: isMobile ? "320px" : "500px",
            height: isMobile ? "320px" : "500px",
            pointerEvents: "none",
          }}
        />
        <canvas
          ref={drawCanvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
          style={{
            position: "relative",
            border: "3px solid #fff",
            borderRadius: "15px",
            width: isMobile ? "320px" : "500px",
            height: isMobile ? "320px" : "500px",
            cursor: tool === "brush" ? "crosshair" : "pointer",
            touchAction: "none",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: "12px 20px",
          borderRadius: "50px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "95vw",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
          <label style={{ fontSize: "11px", color: "#666" }}>筆刷</label>
          <input type="range" min="3" max="30" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} style={{ width: "70px" }} />
          <span style={{ fontSize: "11px", color: "#333" }}>{brushSize}px</span>
        </div>

        <div style={{ width: "1px", height: "40px", backgroundColor: "#ddd" }} />

        <button onClick={() => setTool("brush")} style={{ width: "45px", height: "45px", borderRadius: "50%", border: tool === "brush" ? "3px solid #4CAF50" : "2px solid #ddd", backgroundColor: tool === "brush" ? "#e8f5e9" : "#fff", cursor: "pointer", fontSize: "20px" }}>🖌️</button>
        <button onClick={() => setTool("eraser")} style={{ width: "45px", height: "45px", borderRadius: "50%", border: tool === "eraser" ? "3px solid #4CAF50" : "2px solid #ddd", backgroundColor: tool === "eraser" ? "#e8f5e9" : "#fff", cursor: "pointer", fontSize: "20px" }}>🧹</button>

        <div style={{ width: "1px", height: "40px", backgroundColor: "#ddd" }} />

        <div style={{ position: "relative" }}>
          <button onClick={() => setShowColorPicker(!showColorPicker)} style={{ width: "45px", height: "45px", borderRadius: "50%", border: "3px solid #fff", backgroundColor: currentColor, cursor: "pointer", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)" }} />
          {showColorPicker && (
            <div style={{ position: "absolute", bottom: "55px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#fff", padding: "8px", borderRadius: "10px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)", zIndex: 1000 }}>
              <input type="color" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} style={{ width: "120px", height: "120px", border: "none", borderRadius: "8px", cursor: "pointer" }} />
            </div>
          )}
        </div>

        <button onClick={clearCanvas} style={{ width: "45px", height: "45px", borderRadius: "50%", border: "2px solid #ddd", backgroundColor: "#fff", cursor: "pointer", fontSize: "20px" }}>🔄</button>

        <div style={{ width: "1px", height: "40px", backgroundColor: "#ddd" }} />

        <button onClick={handleFinish} style={{ width: "100px", height: "45px", backgroundImage: "url('/finishButton.png')", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundColor: "transparent", border: "none", cursor: "pointer" }} />
      </div>
    </div>
  );
};

export default CanvasDrawing;