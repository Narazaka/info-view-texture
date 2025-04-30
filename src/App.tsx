import { useState, useRef, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import './App.css';

function App() {
  const [title, setTitle] = useState('');
  const [quote, setQuote] = useState('');
  const [description, setDescription] = useState('');
  const [textColor, setTextColor] = useState('#333');
  const [bgColor, setBgColor] = useState('#f0f0f0');
  const [borderColor, setBorderColor] = useState('#000');
  const [borderWidth, setBorderWidth] = useState(5);
  const [canvasWidth, setCanvasWidth] = useState(500);
  const [canvasHeight, setCanvasHeight] = useState(300);
  const [padding, setPadding] = useState(20);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, charWrap: boolean = false) => {
    if (charWrap) {
      let line = '';
      for (let i = 0; i < text.length; i++) {
        const testLine = line + text[i];
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && line.length > 0) {
          ctx.fillText(line, x, y);
          line = text[i];
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y);
    } else {
      const words = text.split(' ');
      let line = '';
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y);
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set background color
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw border
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        const contentWidth = canvas.width - padding * 2;

        // Draw title
        if (title) {
          ctx.fillStyle = textColor;
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          wrapText(ctx, title, canvas.width / 2, padding, contentWidth, 30, true); // Enable charWrap for title
        }

        // Draw quote
        if (quote) {
          ctx.fillStyle = textColor;
          ctx.font = 'italic 20px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          wrapText(ctx, `"${quote}"`, canvas.width / 2, canvas.height / 2, contentWidth, 25, true); // Enable charWrap for quote
        }

        // Draw description
        if (description) {
          ctx.fillStyle = textColor;
          ctx.font = '16px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          wrapText(ctx, description, canvas.width / 2, canvas.height - padding, contentWidth, 20, true); // Enable charWrap for description
        }
      }
    }
  };

  const debouncedDrawCanvas = useDebouncedCallback(drawCanvas, 300);

  useEffect(() => {
    debouncedDrawCanvas();
  }, [title, quote, description, textColor, bgColor, borderColor, borderWidth, canvasWidth, canvasHeight, padding]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <>
      <div>
        <h1>Text to Image Generator</h1>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter quote"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
          title="Text Color"
        />
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
          title="Background Color"
        />
        <input
          type="color"
          value={borderColor}
          onChange={(e) => setBorderColor(e.target.value)}
          title="Border Color"
        />
        <input
          type="number"
          value={borderWidth}
          onChange={(e) => setBorderWidth(Number(e.target.value))}
          placeholder="Border Width"
        />
        <input
          type="number"
          value={canvasWidth}
          onChange={(e) => setCanvasWidth(Number(e.target.value))}
          placeholder="Canvas Width"
        />
        <input
          type="number"
          value={canvasHeight}
          onChange={(e) => setCanvasHeight(Number(e.target.value))}
          placeholder="Canvas Height"
        />
        <input
          type="number"
          value={padding}
          onChange={(e) => setPadding(Number(e.target.value))}
          placeholder="Padding"
        />
      </div>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ border: '1px solid #000' }}
      ></canvas>
    </>
  );
}

export default App;
