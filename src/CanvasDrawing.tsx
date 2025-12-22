import React, { useRef, useState, useEffect } from "react";

type CanvasDrawingProps = {
  onFinish: (imageDataUrl: string) => void;
};

const CanvasDrawing: React.FC<CanvasDrawingProps> = ({ onFinish }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<"brush" | "eraser">("brush");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  /** 🔒 套用襪子遮罩（只能畫在襪子裡） */
  const applySockClip = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.beginPath();

    // ⚠️ 這是一個「襪子內部」近似遮罩
    ctx.moveTo(250, 130);
    ctx.lineTo(350, 170);
    ctx.lineTo(360, 400);
    ctx.lineTo(300, 520);
    ctx.lineTo(200, 460);
    ctx.lineTo(190, 200);
    ctx.closePath();

    ctx.clip();
  };

  /** 初始化 canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 600;

    const sockImg = new Image();
    sockImg.src = "/sock.png";
    sockImg.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(sockImg, 0, 0, canvas.width, canvas.height);
      applySockClip(ctx);
    };
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing && e.type !== "mousedown" && e.type !== "touchstart") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX =
      "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY =
      "touches" in e ? e.touches[0].clientY : e.clientY;

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

  const stopDrawing = () => setIsDrawing(false);

  /** 重作（仍保留襪子限制） */
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sockImg = new Image();
    sockImg.src = "/sock.png";
    sockImg.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(sockImg, 0, 0, canvas.width, canvas.height);
      applySockClip(ctx);
    };
  };

  const handleFinish = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onFinish(canvas.toDataURL("image/png"));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage: isMobile
          ? "url('/canva-mobile.png')"
          : "url('/canva.png')",
        backgroundSize: "cover",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
          border: "3px solid white",
          borderRadius: "16px",
          touchAction: "none",
        }}
      />

      {/* 工具列 */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          background: "white",
          padding: "12px 20px",
          borderRadius: 40,
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <input
          type="range"
          min={1}
          max={20}
          value={brushSize}
          onChange={(e) => setBrushSize(+e.target.value)}
        />

        <button onClick={() => setTool("brush")}>🖌️</button>
        <button onClick={() => setTool("eraser")}>🧹</button>

        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          style={{ background: currentColor, width: 30, height: 30 }}
        />

        {showColorPicker && (
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
          />
        )}

        <button onClick={clearCanvas}>🔄</button>

        <button
          onClick={handleFinish}
          style={{
            width: 120,
            height: 50,
            backgroundImage: "url('/finishButton.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            border: "none",
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
};

export default CanvasDrawing;
