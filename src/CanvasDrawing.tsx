import React, { useRef, useState, useEffect } from "react";

type CanvasDrawingProps = {
  userEmail: string;
  userName: string;
  userColor: string;
  onFinish: (imageDataUrl: string) => void;
};

const CanvasDrawing: React.FC<CanvasDrawingProps> = ({
  userEmail,
  userName,
  userColor,
  onFinish,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState(userColor);
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<"brush" | "eraser">("brush");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  // 初始化 canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 設置 canvas 尺寸
    canvas.width = 600;
    canvas.height = 600;

    // 載入聖誕襪模板
    const sockImg = new Image();
    sockImg.src = "/sock.png";
    sockImg.onload = () => {
      ctx.drawImage(sockImg, 0, 0, canvas.width, canvas.height);
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

    const canvas = canvasRef.current;
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 重新載入聖誕襪模板
    const sockImg = new Image();
    sockImg.src = "/sock.png";
    sockImg.onload = () => {
      ctx.drawImage(sockImg, 0, 0, canvas.width, canvas.height);
    };
  };

  // 完成繪製
  const handleFinish = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageDataUrl = canvas.toDataURL("image/png");
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
      {/* 畫布區域 */}
      <div
        style={{
          position: "relative",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{
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
          left: "50%",
          transform: "translateX(-50%)",
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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          title="筆刷"
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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          title="橡皮擦"
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
            title="選擇顏色"
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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          title="重新繪製"
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
            transition: "transform 0.1s ease",
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.95)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          title="完成"
        />
      </div>
    </div>
  );
};

export default CanvasDrawing;