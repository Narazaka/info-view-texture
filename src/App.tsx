import { useState, useRef } from 'react';
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDraw = () => {
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

        // Draw title
        if (title) {
          ctx.fillStyle = textColor;
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(title, canvas.width / 2, 10);
        }

        // Draw quote
        if (quote) {
          ctx.fillStyle = textColor;
          ctx.font = 'italic 20px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`"${quote}"`, canvas.width / 2, canvas.height / 2);
        }

        // Draw description
        if (description) {
          ctx.fillStyle = textColor;
          ctx.font = '16px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(description, canvas.width / 2, canvas.height - 10);
        }
      }
    }
  };

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
        <button onClick={handleDraw}>Draw</button>
        <button onClick={handleDownload}>Download Image</button>
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
